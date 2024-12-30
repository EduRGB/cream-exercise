import { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.zerosynth.top');

interface ImageData {
  id: string;
  title: string;
  collectionId: string;
  collectionName: string;
  image_file: string;
  image_data: object[];
  created_updated: string;
}

export function useSingleImage(recordId: string) {
  const [image, setImage] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageLink, setImageLink] = useState<string | null>(null);
  const [tags, setTags] = useState<object | null>(null);

  useEffect(() => {
    const fetchSingleImage = async () => {
      try {
        const record = await pb.collection('images').getOne<ImageData>(recordId);
        setImage(record);
        // Construct the image link
        const link = `https://pocketbase.zerosynth.top/api/files/${record.collectionId}/${record.id}/${record.image_file}`;
        setImageLink(link);
        // Set tags variable
        const tags = record.image_data;
        setTags(tags);
      } catch (error) {
        console.error('Error fetching single image:', error);
      } finally {
        setLoading(false);
      }
    };

    if (recordId) {
      fetchSingleImage();
    }
  }, [recordId]);

  return { image, imageLink, loading, tags };
}
