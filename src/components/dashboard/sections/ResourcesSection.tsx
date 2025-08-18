import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Download, Clock, Star, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Document {
  id: string;
  name: string;
  url: string;
  file_path: string;
  size: number;
  created_at: string;
  updated_at: string;
}

interface VideoCategory {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail_url?: string;
  category_id: string;
  category_name: string;
  created_at: string;
  updated_at: string;
}


// Function to extract YouTube video ID from various URL formats
const getYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

// Function to get YouTube thumbnail URL
const getYouTubeThumbnail = (url: string): string | null => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  
  // Use maxresdefault for highest quality, fallback to hqdefault if needed
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

export const ResourcesSection = () => {
  const [categories, setCategories] = useState<VideoCategory[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(true);
  const [documentsLoading, setDocumentsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchVideos();
    fetchDocuments();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-video-categories');
      
      if (error) throw error;
      
      if (data?.success && data?.data) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-videos');
      if (error) throw error;
      
      const videosData = data?.videos || [];
      setVideos(videosData);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setVideosLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setDocumentsLoading(false);
    }
  };

  const formatFileSize = (sizeInMB: number) => {
    return `${sizeInMB.toFixed(1)} MB`;
  };

  const filteredVideos = selectedCategory === 'All' 
    ? videos 
    : videos.filter(video => video.category_name === selectedCategory);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-indigo-900 mb-2">Life Resources</h1>
        <p className="text-gray-600">Practical tools and content to support your journey.</p>
      </div>

      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="space-y-4">
          <div className="flex gap-2 mb-4 flex-wrap">
            <Badge 
              variant={selectedCategory === 'All' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory('All')}
            >
              All
            </Badge>
            {loading ? (
              <Badge variant="outline">Loading...</Badge>
            ) : (
              categories.map((category) => (
                <Badge 
                  key={category.id}
                  variant={selectedCategory === category.name ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </Badge>
              ))
            )}
          </div>
          
          {videosLoading ? (
            <div className="text-center py-8">Loading videos...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVideos.map((video) => (
                <Card key={video.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                      {(() => {
                        const youtubeThumb = getYouTubeThumbnail(video.url);
                        const thumbnailUrl = video.thumbnail_url || youtubeThumb;
                        
                        return thumbnailUrl ? (
                          <>
                            <img 
                              src={thumbnailUrl} 
                              alt={video.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // If maxresdefault fails, try hqdefault
                                if (youtubeThumb && e.currentTarget.src.includes('maxresdefault')) {
                                  const videoId = getYouTubeVideoId(video.url);
                                  e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                                } else {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }
                              }}
                            />
                            <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100">
                              <Play className="text-gray-400" size={32} />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                              <Play className="text-white" size={40} />
                            </div>
                          </>
                        ) : (
                          <Play className="text-gray-400" size={32} />
                        );
                      })()}
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">{video.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        Video
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(video.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant="secondary" className="mb-3">{video.category_name}</Badge>
                    <Button className="w-full" size="sm" onClick={() => window.open(video.url, '_blank')}>
                      <Play size={14} className="mr-2" />
                      Watch Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="downloads" className="space-y-4">
          {documentsLoading ? (
            <div className="text-center py-8">Loading documents...</div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <FileText className="text-indigo-600" size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{doc.name}</h3>
                          <p className="text-sm text-gray-600">
                            Document • {formatFileSize(doc.size)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Added {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button 
                          size="sm" 
                          onClick={() => window.open(doc.url, '_blank')}
                        >
                          <Download size={14} className="mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {documents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No documents available yet.
                </div>
              )}
            </div>
          )}
        </TabsContent>

      </Tabs>
    </div>
  );
};