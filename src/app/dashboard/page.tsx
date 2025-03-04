'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  Calendar, 
  FileText, 
  Lightbulb, 
  Clock, 
  TrendingUp, 
  BarChart,
  ArrowRight,
  Plus,
  Star,
  BookOpen,
  Bookmark,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import InputCapture from '@/components/ui/input-capture';
import Link from 'next/link';
import { Database } from '@/lib/supabase-types';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [recentIdeas, setRecentIdeas] = useState<any[]>([]);
  const [upcomingContent, setUpcomingContent] = useState<any[]>([]);
  const [isNewUser, setIsNewUser] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    getUser();
    fetchRecentIdeas();
    
    // Simulated data for demo purposes
    setUpcomingContent([
      { id: 1, title: 'Social media calendar for July', due_date: '2023-07-01T00:00:00Z', status: 'in-progress' },
      { id: 2, title: 'Blog post: Content Planning 101', due_date: '2023-06-25T00:00:00Z', status: 'draft' },
    ]);
    
    // Check if user is new
    setTimeout(() => {
      setIsNewUser(recentIdeas.length === 0);
    }, 500);
  }, []);

  async function getUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error getting user:', error);
    }
  }

  // Fetch recent ideas from the database
  async function fetchRecentIdeas() {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user:', userError);
        return;
      }
      
      if (!user) {
        console.error('No user found');
        return;
      }
      
      // Fetch the most recent ideas
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error('Error fetching ideas:', error);
        return;
      }
      
      console.log('Recent ideas fetched:', data);
      setRecentIdeas(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }

  // Handle idea submission
  const handleIdeaSubmit = async (title: string, description: string, contentType?: string) => {
    try {
      setErrorMessage(null);
      
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        setErrorMessage('Authentication error. Please try logging in again.');
        return;
      }
      
      if (!user) {
        setErrorMessage('Please log in to create ideas.');
        return;
      }
      
      // Insert the new idea
      const { data, error } = await supabase
        .from('ideas')
        .insert([
          {
            title: title,
            description: description || '',
            user_id: user.id,
            status: 'draft',
            priority: 'medium',
            is_favorite: false,
            content_type: contentType || 'blog' // Default to blog if no type selected
          }
        ])
        .select();
      
      if (error) {
        setErrorMessage(`Database error: ${error.message}`);
        return;
      }
      
      // Refresh the ideas list
      fetchRecentIdeas();
      
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (id: string, currentStatus: boolean) => {
    try {
      setErrorMessage(null);
      const { error } = await supabase
        .from('ideas')
        .update({ is_favorite: !currentStatus })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating idea:', error);
        setErrorMessage(`Database error: ${error.message} (${error.code})`);
        return;
      }
      
      // Update the idea in the state
      setRecentIdeas(recentIdeas.map(idea => 
        idea.id === id ? { ...idea, is_favorite: !currentStatus } : idea
      ));
    } catch (error) {
      console.error('Unexpected error:', error);
      setErrorMessage(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const stats = [
    { label: 'Ideas Captured', value: 24, icon: Lightbulb, change: '+12%', trend: 'up' },
    { label: 'Content Created', value: 18, icon: FileText, change: '+5%', trend: 'up' },
    { label: 'Upcoming Due', value: 3, icon: Calendar, change: '-2', trend: 'down' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome section for new users */}
      {isNewUser && (
        <Card className="mb-8 bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-700)] text-white p-6 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold mb-2">Welcome to ContentPlanner!</h1>
              <p className="text-[var(--primary-100)] max-w-xl">
                Start by capturing your first content idea below. Your dashboard will fill up with insights as you add more content.
              </p>
            </div>
            <Button 
              variant="secondary" 
              size="lg"
              className="whitespace-nowrap"
              asChild
            >
              <Link href="/ideas">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      )}

      {/* Error message display */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      {/* Quick capture section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Quick Capture</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/ideas" className="text-sm flex items-center">
              View all ideas <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Card className="p-4 transition-all duration-300 hover:shadow-md">
          <InputCapture 
            placeholder="Capture a new content idea..." 
            buttonText="Save Idea"
            onSubmit={handleIdeaSubmit}
          />
        </Card>
      </div>

      {/* Content overview section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Content Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Upcoming content card */}
          <Card className="p-5 hover:shadow-md transition-all duration-300 border-l-4 border-[var(--primary-500)]">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-[var(--primary-100)] dark:bg-[var(--primary-900)] flex items-center justify-center text-[var(--primary-600)] dark:text-[var(--primary-400)]">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="ml-3 font-semibold">Upcoming Content</h3>
            </div>
            
            {upcomingContent.length > 0 ? (
              <div className="space-y-3">
                {upcomingContent.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 rounded-md hover:bg-[var(--gray-100)] dark:hover:bg-[var(--gray-800)] transition-colors">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-[var(--gray-500)]">
                        Due: {new Date(item.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'draft' 
                        ? 'bg-[var(--gray-100)] text-[var(--gray-700)]' 
                        : 'bg-[var(--primary-100)] text-[var(--primary-700)]'
                    }`}>
                      {item.status === 'draft' ? 'Draft' : 'In Progress'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-[var(--gray-500)]">
                <p>No upcoming content</p>
                <Button variant="ghost" size="sm" className="mt-2" asChild>
                  <Link href="/content">Schedule content</Link>
                </Button>
              </div>
            )}
            
            <div className="mt-4 pt-3 border-t border-[var(--gray-200)] dark:border-[var(--gray-700)]">
              <Button variant="ghost" size="sm" className="w-full justify-center" asChild>
                <Link href="/content">
                  View Calendar <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
          
          {/* Saved ideas card */}
          <Card className="p-5 hover:shadow-md transition-all duration-300 border-l-4 border-[var(--teal-500)]">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-[var(--teal-100)] dark:bg-[var(--teal-900)] flex items-center justify-center text-[var(--teal-600)] dark:text-[var(--teal-400)]">
                <Lightbulb className="h-5 w-5" />
              </div>
              <h3 className="ml-3 font-semibold">Saved Ideas</h3>
            </div>
            
            {recentIdeas.length > 0 ? (
              <div className="space-y-3">
                {recentIdeas.map((idea) => (
                  <div key={idea.id} className="flex items-center justify-between p-2 rounded-md hover:bg-[var(--gray-100)] dark:hover:bg-[var(--gray-800)] transition-colors">
                    <div>
                      <p className="font-medium">{idea.title}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--gray-100)] dark:bg-[var(--gray-800)] text-[var(--gray-700)] dark:text-[var(--gray-300)]">
                          {idea.content_type || 'blog'}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--gray-100)] dark:bg-[var(--gray-800)] text-[var(--gray-700)] dark:text-[var(--gray-300)]">
                          {idea.status}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-8 w-8 ${idea.is_favorite ? 'text-yellow-500' : 'text-gray-400'}`}
                      onClick={() => toggleFavorite(idea.id, idea.is_favorite)}
                    >
                      <Star className="h-4 w-4" fill={idea.is_favorite ? 'currentColor' : 'none'} />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-[var(--gray-500)]">
                <p>No saved ideas yet</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2" 
                  onClick={() => {
                    const inputElement = document.querySelector('.input-capture input') as HTMLInputElement;
                    if (inputElement) inputElement.focus();
                  }}
                >
                  Capture an idea
                </Button>
              </div>
            )}
            
            <div className="mt-4 pt-3 border-t border-[var(--gray-200)] dark:border-[var(--gray-700)]">
              <Button variant="ghost" size="sm" className="w-full justify-center" asChild>
                <Link href="/ideas">
                  View All Ideas <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
          
          {/* Swipe files card */}
          <Card className="p-5 hover:shadow-md transition-all duration-300 border-l-4 border-[var(--gray-500)]">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-[var(--gray-100)] dark:bg-[var(--gray-800)] flex items-center justify-center text-[var(--gray-600)] dark:text-[var(--gray-400)]">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="ml-3 font-semibold">Swipe Files</h3>
            </div>
            
            <div className="text-center py-4 text-[var(--gray-500)]">
              <p>Save inspiration and references</p>
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <Link href="/swipe-files">
                  <Plus className="mr-1 h-4 w-4" />
                  Add Swipe File
                </Link>
              </Button>
            </div>
            
            <div className="mt-4 pt-3 border-t border-[var(--gray-200)] dark:border-[var(--gray-700)]">
              <Button variant="ghost" size="sm" className="w-full justify-center" asChild>
                <Link href="/swipe-files">
                  Browse Swipe Files <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent activity and stats section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent activity */}
        <Card className="col-span-1 lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-[var(--primary-100)] dark:bg-[var(--primary-900)] flex items-center justify-center text-[var(--primary-600)] dark:text-[var(--primary-400)] mr-3">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">New idea captured</p>
                <p className="text-sm text-[var(--gray-500)]">Email newsletter redesign</p>
                <p className="text-xs text-[var(--gray-400)]">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-[var(--teal-100)] dark:bg-[var(--teal-900)] flex items-center justify-center text-[var(--teal-600)] dark:text-[var(--teal-400)] mr-3">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Content scheduled</p>
                <p className="text-sm text-[var(--gray-500)]">Blog post: Content Planning 101</p>
                <p className="text-xs text-[var(--gray-400)]">Yesterday</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-[var(--gray-100)] dark:bg-[var(--gray-800)] flex items-center justify-center text-[var(--gray-600)] dark:text-[var(--gray-400)] mr-3">
                <Bookmark className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Swipe file saved</p>
                <p className="text-sm text-[var(--gray-500)]">Email marketing examples</p>
                <p className="text-xs text-[var(--gray-400)]">3 days ago</p>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Quick stats */}
        <Card className="p-5">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-[var(--gray-50)] dark:bg-[var(--gray-800)]">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index === 0 
                      ? 'bg-[var(--primary-100)] text-[var(--primary-600)] dark:bg-[var(--primary-900)] dark:text-[var(--primary-400)]'
                      : index === 1
                        ? 'bg-[var(--teal-100)] text-[var(--teal-600)] dark:bg-[var(--teal-900)] dark:text-[var(--teal-400)]'
                        : 'bg-[var(--gray-100)] text-[var(--gray-600)] dark:bg-[var(--gray-800)] dark:text-[var(--gray-400)]'
                  }`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-[var(--gray-500)]">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                </div>
                <div className={`flex items-center ${
                  stat.trend === 'up' 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <BarChart className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-sm font-medium">{stat.change}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t border-[var(--gray-200)] dark:border-[var(--gray-700)]">
            <Button variant="ghost" size="sm" className="w-full justify-center" asChild>
              <Link href="/analytics">
                View Analytics <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
} 