'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Mic, X, ArrowRight } from 'lucide-react';
import { Button } from './button';
import { CONTENT_TYPES, ContentType } from '@/lib/types/content';

interface InputCaptureProps {
  onSubmit: (title: string, description: string, contentType?: string) => void;
  placeholder?: string;
  buttonText?: string;
}

const InputCapture: React.FC<InputCaptureProps> = ({ 
  onSubmit,
  placeholder = "What's on your mind?",
  buttonText = "Submit"
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Handle click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node) && isExpanded) {
        // Only collapse if there's no content
        if (!title.trim() && !description.trim()) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, title, description]);

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit(title, description, contentType);
      setTitle('');
      setDescription('');
      setContentType('');
      setIsExpanded(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setContentType('');
    setIsExpanded(false);
  };

  return (
    <div
      ref={containerRef}
      className={`input-capture bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-300 ${
        isExpanded ? 'p-6 scale-100' : 'p-4 hover:scale-[1.01]'
      } transform hover:shadow-xl mb-8 border border-transparent hover:border-[var(--primary-100)] dark:hover:border-[var(--primary-800)]`}
    >
      <div
        className={`flex items-center ${!isExpanded ? 'cursor-pointer' : ''}`}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        {!isExpanded && (
          <div className="w-8 h-8 rounded-full bg-[var(--primary-100)] dark:bg-[var(--primary-800)] flex items-center justify-center mr-3 text-[var(--primary-600)] dark:text-[var(--primary-400)]">
            <Plus className="h-4 w-4" />
          </div>
        )}
        <div className="flex-1">
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isExpanded ? "Give your idea a title..." : placeholder}
            className={`w-full bg-transparent border-none focus:outline-none text-gray-800 dark:text-gray-200 font-content ${isExpanded ? 'text-xl font-semibold' : 'text-base'} placeholder-gray-400`}
          />
        </div>
        <div className="flex space-x-2">
          {!isExpanded ? (
            <>
              <button className="icon-button">
                <Mic className="h-5 w-5" />
              </button>
              <Button 
                variant="gradient" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(true);
                }}
              >
                <Plus className="h-4 w-4" />
                {buttonText}
              </Button>
            </>
          ) : (
            <button 
              className="icon-button"
              onClick={handleCancel}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4 space-y-4 animate-fade-in">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details about your idea..."
            className="w-full h-32 bg-gray-50 dark:bg-gray-700 rounded-md p-3 text-gray-800 dark:text-gray-200 font-content focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] transition-all duration-300"
          />
          
          {/* Content Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Content Type</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {CONTENT_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setContentType(type.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    contentType === type.id
                      ? 'border-gray-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{
                    borderColor: contentType === type.id ? type.color : undefined,
                    backgroundColor: contentType === type.id ? `${type.color}10` : undefined
                  }}
                >
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className="font-medium">{type.name}</div>
                  <div className="text-xs text-gray-500">{type.description}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              variant="gradient" 
              size="sm"
              onClick={handleSubmit}
              disabled={!title.trim()}
            >
              Save Idea
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputCapture; 