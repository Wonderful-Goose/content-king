'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Trash, 
  Calendar, 
  Star,
  Tag,
  Plus,
  X,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Database } from '@/lib/supabase-types';

type Idea = Database['public']['Tables']['ideas']['Row'];

export default function IdeaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const supabase = createClientComponentClient<Database>();

  // Fetch idea on component mount
  useEffect(() => {
    if (params.id) {
      fetchIdea(params.id as string);
    }
  }, [params.id]);

  async function fetchIdea(id: string) {
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
      
      // Fetch the idea
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching idea:', error);
        setErrorMessage(`Database error: ${error.message} (${error.code})`);
        return;
      }
      
      if (!data) {
        setErrorMessage('Idea not found or you do not have permission to view it.');
        return;
      }
      
      console.log('Idea fetched:', data);
      setIdea(data);
    } catch (error) {
      console.error('Unexpected error:', error);
      setErrorMessage(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  }

  // Save idea changes
  async function saveIdea() {
    if (!idea) return;
    
    try {
      setSaving(true);
      setErrorMessage(null);
      
      const { error } = await supabase
        .from('ideas')
        .update({
          title: idea.title,
          description: idea.description,
          tags: idea.tags,
          status: idea.status,
          priority: idea.priority,
          notes: idea.notes
        })
        .eq('id', idea.id);
      
      if (error) {
        console.error('Error updating idea:', error);
        setErrorMessage(`Database error: ${error.message} (${error.code})`);
        return;
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Unexpected error:', error);
      setErrorMessage(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setSaving(false);
    }
  }

  // Toggle favorite status
  async function toggleFavorite() {
    if (!idea) return;
    
    try {
      setErrorMessage(null);
      const { error } = await supabase
        .from('ideas')
        .update({ is_favorite: !idea.is_favorite })
        .eq('id', idea.id);
      
      if (error) {
        console.error('Error updating idea:', error);
        setErrorMessage(`Database error: ${error.message} (${error.code})`);
        return;
      }
      
      // Update the idea in the state
      setIdea({ ...idea, is_favorite: !idea.is_favorite });
    } catch (error) {
      console.error('Unexpected error:', error);
      setErrorMessage(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Delete idea
  async function deleteIdea() {
    if (!idea) return;
    
    if (!confirm('Are you sure you want to delete this idea? This action cannot be undone.')) {
      return;
    }
    
    try {
      setErrorMessage(null);
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', idea.id);
      
      if (error) {
        console.error('Error deleting idea:', error);
        setErrorMessage(`Database error: ${error.message} (${error.code})`);
        return;
      }
      
      // Redirect back to ideas page
      router.push('/ideas');
    } catch (error) {
      console.error('Unexpected error:', error);
      setErrorMessage(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Handle adding a new tag
  const handleAddTag = () => {
    if (!idea) return;
    
    if (tagInput.trim() && (!idea.tags || !idea.tags.includes(tagInput.trim()))) {
      const newTags = idea.tags ? [...idea.tags, tagInput.trim()] : [tagInput.trim()];
      setIdea({ ...idea, tags: newTags });
      setTagInput('');
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove: string) => {
    if (!idea || !idea.tags) return;
    
    setIdea({
      ...idea,
      tags: idea.tags.filter(tag => tag !== tagToRemove)
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[var(--primary-500)] border-r-transparent"></div>
          <p className="mt-2 text-[var(--gray-500)]">Loading idea...</p>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-4">Idea Not Found</h2>
          <p className="text-[var(--gray-500)] mb-6">
            {errorMessage || "The idea you're looking for doesn't exist or you don't have permission to view it."}
          </p>
          <Button asChild>
            <Link href="/ideas">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Ideas
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link href="/ideas">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? (
              <input
                type="text"
                value={idea.title}
                onChange={(e) => setIdea({ ...idea, title: e.target.value })}
                className="w-full p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)]"
              />
            ) : (
              idea.title
            )}
          </h1>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="gradient" 
                onClick={saveIdea}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleFavorite}
                className={idea.is_favorite ? 'text-yellow-500' : 'text-gray-400'}
              >
                <Star className="h-5 w-5" fill={idea.is_favorite ? 'currentColor' : 'none'} />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
              <Button 
                variant="destructive" 
                onClick={deleteIdea}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button 
                variant="gradient" 
                asChild
              >
                <Link href={`/content/new?ideaId=${idea.id}`}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Create Content
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Error message display */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main content */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            {isEditing ? (
              <textarea
                value={idea.description || ''}
                onChange={(e) => setIdea({ ...idea, description: e.target.value })}
                className="w-full p-2 border rounded-md h-40 focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)]"
                placeholder="Describe your idea..."
              />
            ) : (
              <p className="text-[var(--gray-700)] whitespace-pre-wrap">
                {idea.description || 'No description provided.'}
              </p>
            )}
          </Card>

          {/* Notes */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Notes</h2>
            {isEditing ? (
              <textarea
                value={idea.notes || ''}
                onChange={(e) => setIdea({ ...idea, notes: e.target.value })}
                className="w-full p-2 border rounded-md h-40 focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)]"
                placeholder="Add notes about your idea..."
              />
            ) : (
              <p className="text-[var(--gray-700)] whitespace-pre-wrap">
                {idea.notes || 'No notes added yet.'}
              </p>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          {/* Metadata */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Details</h2>
            
            <div className="space-y-4">
              {/* Status */}
              <div>
                <h3 className="text-sm font-medium text-[var(--gray-500)] mb-1">Status</h3>
                {isEditing ? (
                  <select
                    value={idea.status}
                    onChange={(e) => setIdea({ ...idea, status: e.target.value })}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)]"
                  >
                    <option value="draft">Draft</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                ) : (
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    idea.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : idea.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {idea.status.charAt(0).toUpperCase() + idea.status.slice(1).replace('-', ' ')}
                  </div>
                )}
              </div>
              
              {/* Priority */}
              <div>
                <h3 className="text-sm font-medium text-[var(--gray-500)] mb-1">Priority</h3>
                {isEditing ? (
                  <select
                    value={idea.priority}
                    onChange={(e) => setIdea({ ...idea, priority: e.target.value })}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                ) : (
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    idea.priority === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : idea.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {idea.priority.charAt(0).toUpperCase() + idea.priority.slice(1)}
                  </div>
                )}
              </div>
              
              {/* Created/Updated dates */}
              <div>
                <h3 className="text-sm font-medium text-[var(--gray-500)] mb-1">Created</h3>
                <p className="text-[var(--gray-700)]">
                  {new Date(idea.created_at).toLocaleDateString()} at {new Date(idea.created_at).toLocaleTimeString()}
                </p>
              </div>
              
              {idea.updated_at && idea.updated_at !== idea.created_at && (
                <div>
                  <h3 className="text-sm font-medium text-[var(--gray-500)] mb-1">Last Updated</h3>
                  <p className="text-[var(--gray-700)]">
                    {new Date(idea.updated_at).toLocaleDateString()} at {new Date(idea.updated_at).toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>
          </Card>
          
          {/* Tags */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Tags</h2>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {idea.tags && idea.tags.length > 0 ? (
                idea.tags.map((tag, index) => (
                  <div 
                    key={index} 
                    className="bg-[var(--primary-100)] text-[var(--primary-700)] px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    {isEditing && (
                      <button 
                        type="button" 
                        className="ml-1 text-[var(--primary-500)] hover:text-[var(--primary-700)]"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-[var(--gray-500)]">No tags added yet.</p>
              )}
            </div>
            
            {isEditing && (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a tag"
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)]"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddTag}
                >
                  Add
                </Button>
              </div>
            )}
          </Card>
          
          {/* Related Content */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Related Content</h2>
            
            <div className="space-y-2">
              <p className="text-[var(--gray-500)]">No content items created from this idea yet.</p>
              <Button 
                variant="outline" 
                className="w-full" 
                asChild
              >
                <Link href={`/content/new?ideaId=${idea.id}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Content
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 