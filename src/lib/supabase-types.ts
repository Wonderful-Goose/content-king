export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string | null
          avatar_url: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      swipe_files: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          title: string
          description: string | null
          url: string | null
          content: string | null
          image_url: string | null
          user_id: string
          tags: string[] | null
          source: string | null
          favorite: boolean
          archived: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          title: string
          description?: string | null
          url?: string | null
          content?: string | null
          image_url?: string | null
          user_id: string
          tags?: string[] | null
          source?: string | null
          favorite?: boolean
          archived?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          title?: string
          description?: string | null
          url?: string | null
          content?: string | null
          image_url?: string | null
          user_id?: string
          tags?: string[] | null
          source?: string | null
          favorite?: boolean
          archived?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "swipe_files_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ideas: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          title: string
          description: string | null
          content: string | null
          user_id: string
          tags: string[] | null
          status: string
          is_favorite: boolean
          priority: string
          notes: string | null
          content_type: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          title: string
          description?: string | null
          content?: string | null
          user_id: string
          tags?: string[] | null
          status?: string
          is_favorite?: boolean
          priority?: string
          notes?: string | null
          content_type?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          title?: string
          description?: string | null
          content?: string | null
          user_id?: string
          tags?: string[] | null
          status?: string
          is_favorite?: boolean
          priority?: string
          notes?: string | null
          content_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ideas_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      content_items: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          title: string
          description: string | null
          content: string | null
          user_id: string
          idea_id: string | null
          tags: string[] | null
          content_type: string
          status: string
          scheduled_date: string | null
          published_date: string | null
          archived: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          title: string
          description?: string | null
          content?: string | null
          user_id: string
          idea_id?: string | null
          tags?: string[] | null
          content_type: string
          status?: string
          scheduled_date?: string | null
          published_date?: string | null
          archived?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          title?: string
          description?: string | null
          content?: string | null
          user_id?: string
          idea_id?: string | null
          tags?: string[] | null
          content_type?: string
          status?: string
          scheduled_date?: string | null
          published_date?: string | null
          archived?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "content_items_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_idea_id_fkey"
            columns: ["idea_id"]
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          }
        ]
      }
      tags: {
        Row: {
          id: string
          created_at: string
          name: string
          user_id: string
          color: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          user_id: string
          color?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          user_id?: string
          color?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tags_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      notes: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          content: string
          user_id: string
          idea_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          content: string
          user_id: string
          idea_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          content?: string
          user_id?: string
          idea_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_idea_id_fkey"
            columns: ["idea_id"]
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          }
        ]
      }
      swipe_file_references: {
        Row: {
          id: string
          created_at: string
          swipe_file_id: string
          idea_id: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          swipe_file_id: string
          idea_id: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          swipe_file_id?: string
          idea_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "swipe_file_references_swipe_file_id_fkey"
            columns: ["swipe_file_id"]
            referencedRelation: "swipe_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swipe_file_references_idea_id_fkey"
            columns: ["idea_id"]
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swipe_file_references_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 