import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Download, ShoppingCart, Clock, Star } from 'lucide-react';

const videos = [
  { id: 1, title: 'Managing Anxiety in Daily Life', duration: '12 min', rating: 4.8, category: 'Anxiety' },
  { id: 2, title: 'Building Self-Confidence', duration: '18 min', rating: 4.9, category: 'Self-esteem' },
  { id: 3, title: 'Healthy Communication Skills', duration: '15 min', rating: 4.7, category: 'Relationships' },
  { id: 4, title: 'Mindfulness Meditation for Beginners', duration: '22 min', rating: 4.6, category: 'Mindfulness' },
  { id: 5, title: 'Overcoming Procrastination', duration: '14 min', rating: 4.8, category: 'Productivity' },
  { id: 6, title: 'Better Sleep Habits', duration: '16 min', rating: 4.9, category: 'Sleep' }
];

const downloads = [
  { id: 1, title: 'Anxiety Management Workbook', type: 'PDF', size: '2.3 MB', price: 'Free' },
  { id: 2, title: 'Sleep Hygiene Guide', type: 'PDF', size: '1.8 MB', price: 'Free' },
  { id: 3, title: '30-Day Self-Care Challenge', type: 'Workbook', size: '4.1 MB', price: '$9.99' }
];

const products = [
  { id: 1, name: 'Mindfulness Journal', price: '$24.99', image: '/placeholder.svg', recommended: true },
  { id: 2, name: 'Stress Relief Kit', price: '$39.99', image: '/placeholder.svg', recommended: false },
  { id: 3, name: 'Sleep Support Bundle', price: '$29.99', image: '/placeholder.svg', recommended: true }
];

export const ResourcesSection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-indigo-900 mb-2">Life Resources</h1>
        <p className="text-gray-600">Practical tools and content to support your journey.</p>
      </div>

      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="inventory">My Items</TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Badge variant="outline">All</Badge>
            <Badge variant="outline">Anxiety</Badge>
            <Badge variant="outline">Relationships</Badge>
            <Badge variant="outline">Self-esteem</Badge>
            <Badge variant="outline">Sleep</Badge>
            <Badge variant="outline">Mindfulness</Badge>
            <Badge variant="outline">Productivity</Badge>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <Card key={video.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <Play className="text-gray-400" size={32} />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{video.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {video.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      {video.rating}
                    </div>
                  </div>
                  <Badge variant="secondary" className="mb-3">{video.category}</Badge>
                  <Button className="w-full" size="sm">
                    <Play size={14} className="mr-2" />
                    Watch Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="downloads" className="space-y-4">
          <div className="space-y-4">
            {downloads.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Download className="text-indigo-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.type} • {item.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-indigo-600">{item.price}</span>
                      <Button size="sm">
                        {item.price === 'Free' ? 'Download' : 'Purchase'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <ShoppingCart className="text-gray-400" size={32} />
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    {product.recommended && (
                      <Badge className="bg-green-100 text-green-800 text-xs">Recommended</Badge>
                    )}
                  </div>
                  <p className="text-lg font-semibold text-indigo-600 mb-3">{product.price}</p>
                  <Button className="w-full" size="sm">
                    <ShoppingCart size={14} className="mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Downloaded Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center py-8">No items downloaded yet. Explore our free resources to get started!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};