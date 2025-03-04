'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  Plus, 
  Search, 
  Filter, 
  Star, 
  MoreHorizontal, 
  Tag,
  Trash,
  Edit,
  Calendar,
  X,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Database } from '@/lib/supabase-types';
import { CONTENT_TYPES } from '@/lib/types/content';

type Idea = Database['public']['Tables']['ideas']['Row'];

// Define the type for our new idea form
interface NewIdeaForm {
  title: string;
  description: string;
  content_type: string;
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    favorites: false
  });
  const [newIdea, setNewIdea] = useState<NewIdeaForm>({ 
    title: '', 
    description: '', 
    content_type: '' 
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  // Fetch ideas on component mount
  useEffect(() => {
    fetchIdeas();
  }, []);

  async function fetchIdeas() {
    try {
      setLoading(true);
      setErrorMessage(null);
      
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user:', userError);
        setErrorMessage(`Authentication error: ${userError.message}`);
        return;
      }
      
      if (!user) {
        console.error('No user found');
        setErrorMessage('No authenticated user found. Please log in.');
        return;
      }
      
      console.log('Fetching ideas for user:', user.id);
      
      // First, let's check what tables are available
      const { data: tableData, error: tableError } = await supabase
        .from('ideas')
        .select('*')
        .limit(1);
        
      if (tableError) {
        console.error('Error checking ideas table:', tableError);
        setErrorMessage(`Table error: ${tableError.message} (${tableError.code})`);
        return;
      }
      
      console.log('Ideas table structure sample:', tableData);
      
      // Fetch ideas for the current user
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching ideas:', error);
        setErrorMessage(`Database error: ${error.message} (${error.code})`);
        return;
      }
      
      console.log('Ideas fetched:', data);
      setIdeas(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
      setErrorMessage(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  }

  // Filter ideas based on search query and filters
  const filteredIdeas = ideas.filter(idea => {
    // Text search filter
    const matchesSearch = 
      searchQuery === '' || 
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (idea.description && idea.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter
    const matchesStatus = 
      filters.status.length === 0 || 
      filters.status.includes(idea.status);
    
    // Priority filter
    const matchesPriority = 
      filters.priority.length === 0 || 
      filters.priority.includes(idea.priority);
    
    // Favorites filter
    const matchesFavorites = 
      !filters.favorites || 
      idea.is_favorite;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesFavorites;
  });

  // Toggle a filter value
  const toggleFilter = (type: 'status' | 'priority', value: string) => {
    setFilters(prev => {
      const current = [...prev[type]];
      const index = current.indexOf(value);
      
      if (index === -1) {
        // Add the value
        return { ...prev, [type]: [...current, value] };
      } else {
        // Remove the value
        current.splice(index, 1);
        return { ...prev, [type]: current };
      }
    });
  };

  // Toggle favorites filter
  const toggleFavoritesFilter = () => {
    setFilters(prev => ({ ...prev, favorites: !prev.favorites }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      status: [],
      priority: [],
      favorites: false
    });
    setSearchQuery('');
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setErrorMessage(null);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        setErrorMessage('Authentication error. Please try logging in again.');
        return;
      }
      
      if (!user) {
        setErrorMessage('Please log in to create ideas.');
        return;
      }
      
      const newIdeaData = {
        title: newIdea.title,
        description: newIdea.description || '',
        user_id: user.id,
        status: 'draft',
        is_favorite: false,
        priority: 'medium',
        content_type: newIdea.content_type
      };
      
      const { data, error } = await supabase
        .from('ideas')
        .insert([newIdeaData])
        .select();
      
      if (error) {
        setErrorMessage(error.message);
        return;
      }
      
      if (data && data.length > 0) {
        setIdeas([data[0], ...ideas]);
        setNewIdea({ title: '', description: '', content_type: '' });
        setShowForm(false);
      } else {
        setErrorMessage('Failed to create idea. Please try again.');
      }
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
      setIdeas(ideas.map(idea => 
        idea.id === id ? { ...idea, is_favorite: !currentStatus } : idea
      ));
    } catch (error) {
      console.error('Unexpected error:', error);
      setErrorMessage(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Delete an idea
  const deleteIdea = async (id: string) => {
    if (!confirm('Are you sure you want to delete this idea?')) {
      return;
    }
    
    try {
      setErrorMessage(null);
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting idea:', error);
        setErrorMessage(`Database error: ${error.message} (${error.code})`);
        return;
      }
      
      // Remove the idea from the state
      setIdeas(ideas.filter(idea => idea.id !== id));
    } catch (error) {
      console.error('Unexpected error:', error);
      setErrorMessage(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="space-y-6 container mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ideas</h1>
          <p className="text-muted-foreground">
            Capture and develop your content ideas.
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(true)} 
          variant="gradient"
          leftIcon={<Plus className="h-4 w-4" />}
        >
          New Idea
        </Button>
      </div>

      {/* Error message display */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      {/* Search and filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search ideas..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant={showFilters ? "default" : "outline"} 
          leftIcon={<Filter className="h-4 w-4" />}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filter
        </Button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <Card className="p-4 border-[var(--primary-300)] shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Filters</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
            >
              Reset
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status filter */}
            <div>
              <h4 className="font-medium mb-2">Status</h4>
              <div className="space-y-2">
                {['draft', 'in-progress', 'completed'].map(status => (
                  <div key={status} className="flex items-center">
                    <button
                      className={`w-5 h-5 rounded-md border flex items-center justify-center mr-2 ${
                        filters.status.includes(status) 
                          ? 'bg-[var(--primary-500)] border-[var(--primary-500)] text-white' 
                          : 'border-gray-300'
                      }`}
                      onClick={() => toggleFilter('status', status)}
                    >
                      {filters.status.includes(status) && <Check className="h-3 w-3" />}
                    </button>
                    <span className="capitalize">{status}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Priority filter */}
            <div>
              <h4 className="font-medium mb-2">Priority</h4>
              <div className="space-y-2">
                {['low', 'medium', 'high'].map(priority => (
                  <div key={priority} className="flex items-center">
                    <button
                      className={`w-5 h-5 rounded-md border flex items-center justify-center mr-2 ${
                        filters.priority.includes(priority) 
                          ? 'bg-[var(--primary-500)] border-[var(--primary-500)] text-white' 
                          : 'border-gray-300'
                      }`}
                      onClick={() => toggleFilter('priority', priority)}
                    >
                      {filters.priority.includes(priority) && <Check className="h-3 w-3" />}
                    </button>
                    <span className="capitalize">{priority}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Favorites filter */}
            <div>
              <h4 className="font-medium mb-2">Other</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <button
                    className={`w-5 h-5 rounded-md border flex items-center justify-center mr-2 ${
                      filters.favorites 
                        ? 'bg-[var(--primary-500)] border-[var(--primary-500)] text-white' 
                        : 'border-gray-300'
                    }`}
                    onClick={toggleFavoritesFilter}
                  >
                    {filters.favorites && <Check className="h-3 w-3" />}
                  </button>
                  <span>Favorites only</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* New idea form */}
      {showForm && (
        <Card className="p-6 mb-6 border-[var(--primary-300)] shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter idea title"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)]"
                  value={newIdea.title}
                  onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="content_type" className="block text-sm font-medium mb-1">
                  Content Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {CONTENT_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => {
                        console.log('Selected content type:', type.id);
                        setNewIdea({ ...newIdea, content_type: type.id });
                      }}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        newIdea.content_type === type.id
                          ? 'border-gray-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{
                        borderColor: newIdea.content_type === type.id ? type.color : undefined,
                        backgroundColor: newIdea.content_type === type.id ? `${type.color}10` : undefined
                      }}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="font-medium">{type.name}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </button>
                  ))}
                </div>
                {!newIdea.content_type && (
                  <p className="text-sm text-red-500 mt-1">Please select a content type</p>
                )}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Describe your idea"
                  className="w-full p-2 border rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)]"
                  value={newIdea.description || ''}
                  onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="gradient"
                  disabled={!newIdea.title.trim() || !newIdea.content_type}
                >
                  Save Idea
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}

      {/* Ideas list */}
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[var(--primary-500)] border-r-transparent"></div>
          <p className="mt-2 text-[var(--gray-500)]">Loading ideas...</p>
        </div>
      ) : filteredIdeas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIdeas.map((idea) => (
            <Card 
              key={idea.id} 
              className="p-5 hover:shadow-md transition-all duration-300 border-l-4 border-[var(--primary-500)]"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{idea.title}</h3>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon-sm"
                    onClick={() => toggleFavorite(idea.id, idea.is_favorite)}
                    className={idea.is_favorite ? 'text-yellow-500' : 'text-gray-400'}
                  >
                    <Star className="h-4 w-4" fill={idea.is_favorite ? 'currentColor' : 'none'} />
                  </Button>
                  <div className="relative group">
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-1">
                        <Link 
                          href={`/ideas/${idea.id}`} 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                        <Link 
                          href={`/content/new?ideaId=${idea.id}`} 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Create Content
                        </Link>
                        <button 
                          onClick={() => deleteIdea(idea.id)}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {idea.description && (
                <p className="text-[var(--gray-600)] dark:text-[var(--gray-300)] mb-3 line-clamp-3">
                  {idea.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-1 mb-3">
                <span 
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    idea.priority === 'high' 
                      ? 'bg-red-100 text-red-700' 
                      : idea.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                  }`}
                >
                  {idea.priority}
                </span>
                <span 
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    idea.status === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : idea.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {idea.status}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-sm text-[var(--gray-500)] pt-2 border-t border-[var(--gray-200)] dark:border-[var(--gray-700)]">
                <span>
                  {new Date(idea.created_at).toLocaleDateString()}
                </span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon-sm" asChild>
                    <Link href={`/ideas/${idea.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon-sm" asChild>
                    <Link href={`/content/new?ideaId=${idea.id}`}>
                      <Calendar className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="text-center py-10">
            <h3 className="text-lg font-medium mb-2">No ideas yet</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filters.status.length > 0 || filters.priority.length > 0 || filters.favorites 
                ? 'No ideas match your filters.' 
                : 'Start capturing your content ideas.'}
            </p>
            {searchQuery || filters.status.length > 0 || filters.priority.length > 0 || filters.favorites ? (
              <Button 
                onClick={resetFilters}
                variant="outline"
              >
                Clear Filters
              </Button>
            ) : (
              <Button 
                onClick={() => setShowForm(true)}
                variant="gradient"
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add Idea
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 