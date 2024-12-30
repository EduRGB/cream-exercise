import { useState, useContext } from 'react';
import { RecordIdContext } from '../context/RecordIdContext';
import { Box, Button, FileInput, Progress, Title, Text, TextInput } from '@mantine/core';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.zerosynth.top');

const UploadImage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [progress, setProgress] = useState(0);
  const { recordId, setRecordId } = useContext(RecordIdContext);

  const handleUpload = async () => {
    if (!file) return;

    // Reset progress before upload
    setProgress(0);

    try {
      // Generate a random ID
      let randomId = Math.floor(Math.random() * 1000000).toString();
      randomId = randomId.padStart(15, '0')

      // Example JSON data
      const tags = [
        {
          name: 'Example Tag',
          coordinates: { x: 20, y: 30 },
        },
      ];

      // Prepare FormData
      const formData = new FormData();
      formData.append('title', title);
      formData.append('id', randomId);
      formData.append('image_data', JSON.stringify(tags));
      formData.append('image_file', file);

      // Create record in PocketBase
      const record = await pb.collection('images').create(formData);

      // If success, set progress to 100%
      setProgress(100);
      console.log('Created record:', record);
      setRecordId(formData.get('id'))
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <Box style={{ margin: 'auto', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <Title order={3} style={{ paddingBottom: '1rem' }}>
        Upload Image
      </Title>

      <Box mb="lg" style={{ display: 'flex' }}>
        <FileInput
          accept="image/png,image/jpeg,image/webp"
          clearable
          variant="filled"
          placeholder="Choose file..."
          onChange={(value) => setFile(value)}
          style={{ flex: 1 }}
        />

        <TextInput
          placeholder="Title"
          style={{ flex: 1, marginLeft: '0.5rem' }}
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
        />

        <Button onClick={handleUpload} disabled={!file} style={{ marginLeft: '0.5rem' }}>
          Upload
        </Button>
      </Box>

      <Box>
        <Text>
          {progress > 0 ? `Uploading: ${progress}%` : 'No upload in progress'}
        </Text>
        <Progress value={progress} size="lg" mt="xs" />
      </Box>
    </Box>
  );
};

export default UploadImage;
