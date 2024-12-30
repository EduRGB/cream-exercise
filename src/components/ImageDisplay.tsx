import React, { useState, useEffect } from 'react';
import { Box, Button, List, Loader, Title, Text, TextInput } from '@mantine/core';
import PocketBase from 'pocketbase';

import { useSingleImage } from '../hooks/useSingleImage';

// Instantiate PocketBase client
const pb = new PocketBase('https://pocketbase.zerosynth.top');

interface ImageDisplayProps {
  recordId: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ recordId }) => {
  const { image, imageLink, loading, tags: initialTags } = useSingleImage(recordId);

  // Locally track tags (to update them after creating a new tag)
  const [tagsState, setTagsState] = useState(initialTags || []);
  // Store the coordinates of the click
  const [clickedCoords, setClickedCoords] = useState({ x: 0, y: 0 });
  // Store the name of the new tag
  const [newTagName, setNewTagName] = useState('');

  // hook re-fetches or first load, ensure local state is in sync
  useEffect(() => {
    if (initialTags) {
      setTagsState(initialTags);
    }
  }, [initialTags]);

  // Handle click on the 600×600 container
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const xPercent = Math.round((offsetX / 600) * 100);
    const yPercent = Math.round((offsetY / 600) * 100);

    setClickedCoords({ x: xPercent, y: yPercent });
  };

  // creating new tag
  const handleAddTag = async () => {
    if (!newTagName.trim()) return; // Skip empty tag names

    // Build a new tag object
    const newTag = {
      name: newTagName.trim(),
      coordinates: {
        x: clickedCoords.x,
        y: clickedCoords.y,
      },
    };

    // Locally append the new tag to our existing tags
    const updatedTags = [...tagsState, newTag];

    try {
      // 1) Update the record in PocketBase
      await pb.collection('images').update(recordId, {
        image_data: updatedTags,
      });

      // 2) Immediately fetch the updated record
      const updatedRecord = await pb.collection('images').getOne(recordId);

      // 3) Update our local state with the new data
      setTagsState(updatedRecord.image_data);

      // 4) Clear the newTagName input
      setNewTagName('');
    } catch (error) {
      console.error('Error updating image_data with new tag:', error);
    }
  };

  // Handle resetting tags
  const handleResetTags = async () => {
    const exampleTag = {
      name: 'Example Tag',
      coordinates: { x: 20, y: 30 },
    };

    try {
      // 1) Update with just the single example tag
      await pb.collection('images').update(recordId, {
        image_data: [exampleTag],
      });

      // 2) Re-fetch the updated record
      const updatedRecord = await pb.collection('images').getOne(recordId);

      // 3) Update local state
      setTagsState(updatedRecord.image_data);
    } catch (error) {
      console.error('Error resetting tags:', error);
    }
  };

  if (loading) {
    return (
      <Box>
        <Loader color="blue" />
        <Text>Loading image...</Text>
      </Box>
    );
  }

  if (!image || !imageLink) {
    return (
      <Box>
        <Text>No image loaded.</Text>
      </Box>
    );
  }

  return (
    <Box
      style={{
        margin: 'auto',
        padding: '1rem',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
      }}
    >
      <Title order={3} style={{ paddingBottom: '1rem' }}>
        {image.title}
      </Title>

      <Box mb="lg" style={{ display: 'flex' }}>
        {/* Image & existing tags */}
        <Box
          onClick={handleImageClick}
          style={{
            position: 'relative',
            width: '600px',
            height: '600px',
            minWidth: '600px',
            minHeight: '600px',
            maxWidth: '600px',
            maxHeight: '600px',
            overflow: 'hidden',
            cursor: 'crosshair',
          }}
        >
          <img
            src={imageLink}
            alt={image.title}
            className="square-img"
            style={{
              width: '600px',
              height: '600px',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />

          {tagsState.map((tag, index) => (
            <Box
              key={index}
              style={{
                position: 'absolute',
                top: `${tag.coordinates.y}%`,
                left: `${tag.coordinates.x}%`,
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '1rem',
              }}
            >
              {tag.name}
            </Box>
          ))}
        </Box>

        {/* Tag list and "Add Tag" form */}
        <Box style={{ flex: '1 1 40%', margin: '1rem' }}>
          <Title order={3} style={{ paddingBottom: '1rem' }}>
            Image Tags
          </Title>
          <List>
            {tagsState.map((tag, index) => (
              <List.Item key={index}>
                <strong>{tag.name}: </strong>
                (x: {tag.coordinates.x}, y: {tag.coordinates.y})
              </List.Item>
            ))}
          </List>

          <Box style={{ margin: '1rem' }}>
            <Title order={3} style={{ paddingBottom: '1rem', paddingTop: '2rem' }}>
              New Tag
            </Title>

            <Text>Clicked position:</Text>
            <Text>
              x: {clickedCoords.x}, y: {clickedCoords.y}
            </Text>

            <TextInput
              placeholder="Tag name"
              style={{ marginTop: '1rem' }}
              value={newTagName}
              onChange={(e) => setNewTagName(e.currentTarget.value)}
            />

            <Button
              variant="filled"
              fullWidth
              style={{ marginTop: '1rem' }}
              onClick={handleAddTag}
            >
              Add Tag
            </Button>

            <Button
              variant="filled"
              fullWidth
              color="red"
              style={{ marginTop: '2rem' }}
              onClick={handleResetTags}
            >
              Reset Tags
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ImageDisplay;
