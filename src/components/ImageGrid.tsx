import { useEffect, useState, useContext } from "react";
import { RecordIdContext } from '../context/RecordIdContext';
import { Box, SimpleGrid, Image, Text } from "@mantine/core";
import PocketBase from "pocketbase";

const pb = new PocketBase("https://pocketbase.zerosynth.top");

// Define received data
interface ImageData {
  collectionId: string;
  collectionName: string;
  created_updated: string;
  id: string;
  image_data: {
    name: string;
    coordinates: {
      x: number;
      y: number;
    };
  }[];
  image_file: string;
  title: string;
}

const ImageGrid = () => {
  const [images, setImages] = useState<ImageData[]>([]);

  const { recordId, setRecordId } = useContext(RecordIdContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const records = await pb.collection("images").getFullList<ImageData>({
          sort: "title",
        });

        setImages(records);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchData();
  }, [recordId]);

  return (
    <Box
      style={{
        margin: "auto",
        padding: "1rem",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
      }}
    >
      <SimpleGrid cols={2}>
        {images.map((image) => {
          // Dynamic Link
          const imageLink = `https://pocketbase.zerosynth.top/api/files/${image.collectionId}/${image.id}/${image.image_file}`;

          return (
            <div key={image.id}>
              <Image height={200} fit="contain" src={imageLink} alt={image.title} className="click-img" onClick={() => setRecordId(image.id)} />
              <Text>{image.title}</Text>
            </div>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default ImageGrid;
