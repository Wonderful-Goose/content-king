Revised Implementation Plan for ContentCanvas
=============================================

Project Configuration
---------------------

*   \[ \] Step 1: Supabase Client Configuration
    
    *   **Task**: Set up Supabase client utility to connect to your existing Supabase instance and configure environment variables.
        
    *   **Files**:
        
        *   src/lib/supabase.ts: Supabase client utility
            
        *   .env.local: Environment variables with Supabase credentials
            
        *   src/lib/supabase-types.ts: Type definitions for Supabase tables
            
    *   **Step Dependencies**: None (leverages existing project)
        
    *   **User Instructions**: Add your Supabase project URL and anon key to .env.local file.
        
*   \[ \] Step 2: Update Layout and Add Basic Navigation
    
    *   **Task**: Update the existing layout component and add navigation elements for the application.
        
    *   **Files**:
        
        *   src/app/layout.tsx: Update root layout component
            
        *   src/components/layout/Navbar.tsx: Navigation bar component
            
        *   src/components/layout/Sidebar.tsx: Sidebar navigation component
            
        *   src/app/page.tsx: Update landing page/dashboard
            
    *   **Step Dependencies**: None (leverages existing project)
        
    *   **User Instructions**: None
        

Authentication and Database Schema
----------------------------------

*   \[ \] Step 3: Implement Authentication Components
    
    *   **Task**: Create reusable authentication components using Supabase Auth and Shadcn UI.
        
    *   **Files**:
        
        *   src/components/auth/LoginForm.tsx: Login form component
            
        *   src/components/auth/RegisterForm.tsx: Registration form component
            
        *   src/components/auth/ResetPasswordForm.tsx: Password reset form
            
    *   **Step Dependencies**: Step 1
        
    *   **User Instructions**: None
        
*   \[ \] Step 4: Authentication Pages and Routes
    
    *   **Task**: Implement authentication pages for login, registration, and password reset.
        
    *   **Files**:
        
        *   src/app/auth/login/page.tsx: Login page
            
        *   src/app/auth/register/page.tsx: Registration page
            
        *   src/app/auth/reset-password/page.tsx: Password reset page
            
        *   src/app/auth/callback/route.ts: Auth callback handler
            
    *   **Step Dependencies**: Step 3
        
    *   **User Instructions**: None
        
*   \[ \] Step 5: Authentication Context and Hooks
    
    *   **Task**: Create authentication context provider and custom hooks for managing auth state.
        
    *   **Files**:
        
        *   src/lib/auth/AuthContext.tsx: Authentication context provider
            
        *   src/lib/auth/useAuth.ts: Custom auth hook
            
        *   src/lib/auth/protected-route.tsx: Route protection HOC
            
        *   src/middleware.ts: Next.js middleware for auth protection
            
    *   **Step Dependencies**: Step 1, 4
        
    *   **User Instructions**: None
        
*   \[ \] Step 6: Database Schema Creation - Core Tables
    
    *   **Task**: Create the core database tables in your existing Supabase instance.
        
    *   **Files**:
        
        *   src/lib/db/schema.sql: SQL schema definition for core tables
            
    *   **Step Dependencies**: Step 1
        
    *   **User Instructions**: Execute the SQL script in Supabase's SQL Editor to create the core tables.
        
*   \[ \] Step 7: Database Schema Creation - Swipe Files
    
    *   **Task**: Create tables related to swipe files and set up Row Level Security (RLS) policies.
        
    *   **Files**:
        
        *   src/lib/db/swipe-files-schema.sql: SQL schema definition for swipe files
            
    *   **Step Dependencies**: Step 6
        
    *   **User Instructions**: Execute the SQL script in Supabase's SQL Editor.
        
*   \[ \] Step 8: Database Schema Creation - Ideas and Content
    
    *   **Task**: Create tables related to ideas, content items, and set up RLS policies.
        
    *   **Files**:
        
        *   src/lib/db/ideas-content-schema.sql: SQL schema definition for ideas and content
            
    *   **Step Dependencies**: Step 6
        
    *   **User Instructions**: Execute the SQL script in Supabase's SQL Editor.
        
*   \[ \] Step 9: Storage Bucket Setup
    
    *   **Task**: Configure Supabase storage buckets for user uploads and set up access controls.
        
    *   **Files**:
        
        *   src/lib/db/storage-buckets.sql: SQL script for storage bucket configuration
            
    *   **Step Dependencies**: Step 6
        
    *   **User Instructions**: Execute the SQL script in Supabase's SQL Editor.
        

Core UI Components
------------------

*   \[ \] Step 10: Implement Core Shadcn UI Components
    
    *   **Task**: Add essential Shadcn UI components that will be used throughout the application.
        
    *   **Files**:
        
        *   src/components/ui/button.tsx: Button component
            
        *   src/components/ui/card.tsx: Card component
            
        *   src/components/ui/input.tsx: Input component
            
        *   src/components/ui/modal.tsx: Modal component
            
        *   src/components/ui/dropdown.tsx: Dropdown component
            
        *   src/app/globals.css: Update global styles if needed
            
    *   **Step Dependencies**: Existing project setup
        
    *   **User Instructions**: Use the Shadcn UI CLI to add components: npx shadcn-ui@latest add button card input dialog dropdown-menu
        
*   \[ \] Step 11: Implement Tag System Components
    
    *   **Task**: Create reusable components for tag creation, display, filtering, and management.
        
    *   **Files**:
        
        *   src/components/tags/TagInput.tsx: Component for adding/editing tags
            
        *   src/components/tags/TagDisplay.tsx: Component for displaying tags
            
        *   src/components/tags/TagFilter.tsx: Component for filtering by tags
            
        *   src/lib/actions/tags.ts: Server actions for tag management
            
        *   src/app/api/tags/route.ts: API endpoints for tags
            
    *   **Step Dependencies**: Step 6, 10
        
    *   **User Instructions**: None
        
*   \[ \] Step 12: Implement Rich Text Editor Component
    
    *   **Task**: Set up a rich text editor component for idea development and content creation.
        
    *   **Files**:
        
        *   src/components/editor/RichTextEditor.tsx: Main editor component
            
        *   src/components/editor/EditorToolbar.tsx: Editor toolbar
            
        *   src/components/editor/EditorPlugins.tsx: Editor plugins
            
        *   src/lib/editor/utils.ts: Editor utility functions
            
    *   **Step Dependencies**: Step 10
        
    *   **User Instructions**: Install required dependencies for the rich text editor: npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
        

Swipe File Collection Feature
-----------------------------

*   \[ \] Step 13: Implement Swipe File Server Actions
    
    *   **Task**: Create server actions for CRUD operations on swipe files.
        
    *   **Files**:
        
        *   src/lib/actions/swipe-files.ts: Server actions for swipe files
            
        *   src/lib/validation/swipe-file-schema.ts: Validation schemas
            
        *   src/lib/db/queries/swipe-files.ts: Database query helpers
            
    *   **Step Dependencies**: Step 7
        
    *   **User Instructions**: None
        
*   \[ \] Step 14: Implement Swipe File API Routes
    
    *   **Task**: Create API endpoints for swipe file management that will be used by both the web app and browser extension.
        
    *   **Files**:
        
        *   src/app/api/swipe-files/route.ts: Main API endpoint
            
        *   src/app/api/swipe-files/\[id\]/route.ts: Single swipe file endpoint
            
        *   src/app/api/swipe-files/metadata/route.ts: Endpoint for extracting metadata
            
    *   **Step Dependencies**: Step 7, 13
        
    *   **User Instructions**: None
        
*   \[ \] Step 15: Implement Swipe File Collection UI - List/Grid View
    
    *   **Task**: Create UI for viewing and managing saved swipe files in both list and grid layouts.
        
    *   **Files**:
        
        *   src/app/swipe-files/page.tsx: Swipe files main page
            
        *   src/components/swipe-files/SwipeFileCard.tsx: Card component for a swipe file
            
        *   src/components/swipe-files/SwipeFileList.tsx: List view component
            
        *   src/components/swipe-files/SwipeFileGrid.tsx: Grid view component
            
        *   src/components/swipe-files/SwipeFileFilter.tsx: Filter component
            
    *   **Step Dependencies**: Step 10, 13, 14
        
    *   **User Instructions**: None
        
*   \[ \] Step 16: Implement Swipe File Detail View
    
    *   **Task**: Create UI for viewing and editing detailed information about a swipe file.
        
    *   **Files**:
        
        *   src/app/swipe-files/\[id\]/page.tsx: Swipe file detail page
            
        *   src/components/swipe-files/SwipeFileViewer.tsx: Viewer component
            
        *   src/components/swipe-files/SwipeFileEditor.tsx: Editor component
            
        *   src/components/swipe-files/SwipeFileMetadata.tsx: Metadata display component
            
    *   **Step Dependencies**: Step 13, 15
        
    *   **User Instructions**: None
        
*   \[ \] Step 17: Implement URL Preview and Metadata Extraction
    
    *   **Task**: Create functionality to fetch and display previews and metadata from saved URLs.
        
    *   **Files**:
        
        *   src/lib/utils/metadata-extractor.ts: Utility for extracting metadata
            
        *   src/components/swipe-files/URLPreview.tsx: URL preview component
            
        *   src/app/api/url-metadata/route.ts: API endpoint for URL metadata extraction
            
    *   **Step Dependencies**: Step 14, 16
        
    *   **User Instructions**: Install necessary packages: npm install cheerio
        

Idea Capture Feature
--------------------

*   \[ \] Step 18: Implement Idea Server Actions
    
    *   **Task**: Create server actions for CRUD operations on ideas.
        
    *   **Files**:
        
        *   src/lib/actions/ideas.ts: Server actions for ideas
            
        *   src/lib/validation/idea-schema.ts: Validation schemas
            
        *   src/lib/db/queries/ideas.ts: Database query helpers
            
    *   **Step Dependencies**: Step 8
        
    *   **User Instructions**: None
        
*   \[ \] Step 19: Implement Quick Idea Input UI
    
    *   **Task**: Create a quick input mechanism for capturing new ideas with minimal friction.
        
    *   **Files**:
        
        *   src/components/ideas/QuickIdeaInput.tsx: Quick input component
            
        *   src/components/ideas/QuickIdeaForm.tsx: Form for quick idea entry
            
        *   src/app/api/ideas/quick/route.ts: API endpoint for quick idea creation
            
    *   **Step Dependencies**: Step 10, 18
        
    *   **User Instructions**: None
        
*   \[ \] Step 20: Implement Ideas List UI
    
    *   **Task**: Create UI for viewing, filtering, and managing saved ideas.
        
    *   **Files**:
        
        *   src/app/ideas/page.tsx: Ideas main page
            
        *   src/components/ideas/IdeaCard.tsx: Card component for an idea
            
        *   src/components/ideas/IdeasList.tsx: List view component
            
        *   src/components/ideas/IdeasFilter.tsx: Filter component
            
        *   src/components/ideas/IdeasSort.tsx: Sort component
            
    *   **Step Dependencies**: Step 10, 18, 19
        
    *   **User Instructions**: None
        
*   \[ \] Step 21: Implement Idea Status Tracking
    
    *   **Task**: Create UI and functionality for tracking and updating idea status.
        
    *   **Files**:
        
        *   src/components/ideas/StatusBadge.tsx: Status badge component
            
        *   src/components/ideas/StatusSelector.tsx: Status selection component
            
        *   src/lib/actions/idea-status.ts: Server actions for status updates
            
        *   src/app/api/ideas/status/\[id\]/route.ts: API endpoint for status updates
            
    *   **Step Dependencies**: Step 18, 20
        
    *   **User Instructions**: None
        

Idea Development Workspace
--------------------------

*   \[ \] Step 22: Implement Idea Workspace Layout
    
    *   **Task**: Create the layout and structure for the idea development workspace.
        
    *   **Files**:
        
        *   src/app/workspace/\[id\]/page.tsx: Workspace page for a specific idea
            
        *   src/components/workspace/WorkspaceLayout.tsx: Layout component
            
        *   src/components/workspace/WorkspaceSidebar.tsx: Sidebar component
            
        *   src/components/workspace/WorkspaceHeader.tsx: Header component
            
    *   **Step Dependencies**: Step 10, 18
        
    *   **User Instructions**: None
        
*   \[ \] Step 23: Implement Rich Text Editing in Workspace
    
    *   **Task**: Integrate the rich text editor component into the workspace for idea development.
        
    *   **Files**:
        
        *   src/components/workspace/WorkspaceEditor.tsx: Editor integration
            
        *   src/lib/actions/save-draft.ts: Server action for saving drafts
            
        *   src/app/api/ideas/drafts/\[id\]/route.ts: API endpoint for draft management
            
    *   **Step Dependencies**: Step 12, 22
        
    *   **User Instructions**: None
        
*   \[ \] Step 24: Implement Swipe File Integration in Workspace
    
    *   **Task**: Create functionality to reference and incorporate swipe files in the idea workspace.
        
    *   **Files**:
        
        *   src/components/workspace/SwipeFileBrowser.tsx: Browser component for swipe files
            
        *   src/components/workspace/SwipeFileReference.tsx: Reference component
            
        *   src/lib/actions/reference-swipefile.ts: Server action for references
            
    *   **Step Dependencies**: Step 13, 22, 23
        
    *   **User Instructions**: None
        
*   \[ \] Step 25: Implement Note-Taking in Workspace
    
    *   **Task**: Add note-taking capabilities to the idea workspace.
        
    *   **Files**:
        
        *   src/components/workspace/Notes.tsx: Notes component
            
        *   src/components/workspace/NoteItem.tsx: Individual note component
            
        *   src/lib/actions/notes.ts: Server actions for notes
            
        *   src/app/api/ideas/notes/\[id\]/route.ts: API endpoint for notes
            
    *   **Step Dependencies**: Step 22, 23
        
    *   **User Instructions**: None
        

Content Conversion & Scheduling
-------------------------------

*   \[ \] Step 26: Implement Content Server Actions
    
    *   **Task**: Create server actions for CRUD operations on content items.
        
    *   **Files**:
        
        *   src/lib/actions/content.ts: Server actions for content
            
        *   src/lib/validation/content-schema.ts: Validation schemas
            
        *   src/lib/db/queries/content.ts: Database query helpers
            
    *   **Step Dependencies**: Step 8
        
    *   **User Instructions**: None
        
*   \[ \] Step 27: Implement Content Conversion UI
    
    *   **Task**: Create UI for converting ideas to scheduled content.
        
    *   **Files**:
        
        *   src/components/content/ConversionForm.tsx: Conversion form component
            
        *   src/app/ideas/\[id\]/convert/page.tsx: Conversion page
            
        *   src/components/content/ContentTypeSelector.tsx: Content type selector
            
        *   src/components/content/PublishDatePicker.tsx: Date picker component
            
    *   **Step Dependencies**: Step 18, 26
        
    *   **User Instructions**: None
        
*   \[ \] Step 28: Implement Content Queue UI
    
    *   **Task**: Create UI for viewing and managing the content queue.
        
    *   **Files**:
        
        *   src/app/content/queue/page.tsx: Content queue page
            
        *   src/components/content/QueueItem.tsx: Queue item component
            
        *   src/components/content/QueueList.tsx: Queue list component
            
        *   src/components/content/QueueFilter.tsx: Filter component
            
    *   **Step Dependencies**: Step 10, 26
        
    *   **User Instructions**: None
        
*   \[ \] Step 29: Implement Drag-and-Drop Rescheduling
    
    *   **Task**: Add drag-and-drop functionality to the content queue for rescheduling.
        
    *   **Files**:
        
        *   src/components/content/DraggableQueue.tsx: Draggable queue component
            
        *   src/lib/actions/reschedule.ts: Server action for rescheduling
            
        *   src/app/api/content/reschedule/route.ts: API endpoint for rescheduling
            
    *   **Step Dependencies**: Step 26, 28
        
    *   **User Instructions**: Install required dependencies: npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
        

Content Views
-------------

*   \[ \] Step 30: Implement Calendar View
    
    *   **Task**: Create a calendar view for visualizing scheduled content.
        
    *   **Files**:
        
        *   src/app/content/calendar/page.tsx: Calendar page
            
        *   src/components/calendar/Calendar.tsx: Calendar component
            
        *   src/components/calendar/CalendarEvent.tsx: Calendar event component
            
        *   src/components/calendar/CalendarToolbar.tsx: Calendar toolbar
            
        *   src/lib/utils/calendar-helpers.ts: Calendar utility functions
            
    *   **Step Dependencies**: Step 26, 28
        
    *   **User Instructions**: Install a calendar library: npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/interaction
        
*   \[ \] Step 31: Implement Calendar Integration with Content Items
    
    *   **Task**: Integrate content items with the calendar view.
        
    *   **Files**:
        
        *   src/lib/actions/calendar-events.ts: Server actions for calendar events
            
        *   src/components/calendar/ContentCalendarEvent.tsx: Content calendar event
            
        *   src/app/api/content/calendar/route.ts: API endpoint for calendar data
            
    *   **Step Dependencies**: Step 26, 30
        
    *   **User Instructions**: None
        

Dashboard and Analytics
-----------------------

*   \[ \] Step 32: Implement Dashboard UI
    
    *   **Task**: Create the main dashboard with overviews of key features.
        
    *   **Files**:
        
        *   src/app/dashboard/page.tsx: Dashboard page
            
        *   src/components/dashboard/StatsCard.tsx: Stats card component
            
        *   src/components/dashboard/RecentSwipeFiles.tsx: Recent swipe files component
            
        *   src/components/dashboard/UpcomingContent.tsx: Upcoming content component
            
        *   src/components/dashboard/IdeasSummary.tsx: Ideas summary component
            
    *   **Step Dependencies**: Step 13, 18, 26
        
    *   **User Instructions**: None
        
*   \[ \] Step 33: Implement Basic Analytics
    
    *   **Task**: Set up basic analytics to track feature usage.
        
    *   **Files**:
        
        *   src/lib/analytics/events.ts: Analytics event tracking
            
        *   src/lib/analytics/user-tracking.ts: User activity tracking
            
        *   src/app/api/analytics/route.ts: API endpoint for analytics
            
        *   src/components/analytics/UsageChart.tsx: Usage chart component
            
    *   **Step Dependencies**: Step 32
        
    *   **User Instructions**: None
        

Account Management
------------------

*   \[ \] Step 34: Implement User Profile and Settings
    
    *   **Task**: Create UI for managing user profile and account settings.
        
    *   **Files**:
        
        *   src/app/account/profile/page.tsx: Profile page
            
        *   src/app/account/settings/page.tsx: Settings page
            
        *   src/components/account/ProfileForm.tsx: Profile form component
            
        *   src/components/account/SettingsForm.tsx: Settings form component
            
        *   src/lib/actions/update-profile.ts: Server action for profile updates
            
    *   **Step Dependencies**: Step 5
        
    *   **User Instructions**: None
        

Browser Extension
-----------------

*   \[ \] Step 35: Set Up Browser Extension Project
    
    *   **Task**: Create the basic structure for a Chrome browser extension.
        
    *   **Files**:
        
        *   extension/manifest.json: Extension manifest
            
        *   extension/background.js: Background script
            
        *   extension/popup/popup.html: Popup HTML
            
        *   extension/popup/popup.js: Popup script
            
        *   extension/content/content.js: Content script
            
    *   **Step Dependencies**: Step 14
        
    *   **User Instructions**: None
        
*   \[ \] Step 36: Implement Extension Authentication
    
    *   **Task**: Create authentication flow for the browser extension.
        
    *   **Files**:
        
        *   extension/auth/auth.js: Authentication script
            
        *   extension/auth/auth.html: Authentication page
            
        *   extension/popup/auth-status.js: Auth status component
            
    *   **Step Dependencies**: Step 35
        
    *   **User Instructions**: None
        
*   \[ \] Step 37: Implement URL Saving Functionality
    
    *   **Task**: Create functionality to save URLs and metadata from the browser extension.
        
    *   **Files**:
        
        *   extension/content/metadata-extractor.js: Metadata extraction script
            
        *   extension/popup/save-form.js: Save form component
            
        *   extension/api/api-client.js: API client for communication with main app
            
    *   **Step Dependencies**: Step 35, 36
        
    *   **User Instructions**: None
        

Testing and Optimization
------------------------

*   \[ \] Step 38: Implement Unit Tests for Core Functionality
    
    *   **Task**: Write unit tests for core components and utilities.
        
    *   **Files**:
        
        *   \_\_tests\_\_/components/ui/button.test.tsx: Button tests
            
        *   \_\_tests\_\_/lib/actions/swipe-files.test.ts: Swipe files action tests
            
        *   \_\_tests\_\_/lib/utils/metadata-extractor.test.ts: Metadata extractor tests
            
    *   **Step Dependencies**: Multiple previous steps
        
    *   **User Instructions**: Install testing libraries: npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
        
*   \[ \] Step 39: Implement Integration Tests
    
    *   **Task**: Write integration tests for key features and workflows.
        
    *   **Files**:
        
        *   \_\_tests\_\_/integration/auth-flow.test.tsx: Authentication flow test
            
        *   \_\_tests\_\_/integration/idea-to-content.test.tsx: Idea to content workflow test
            
    *   **Step Dependencies**: Step 38
        
    *   **User Instructions**: None
        
*   \[ \] Step 40: Performance Optimization
    
    *   **Task**: Optimize application performance, including code splitting, lazy loading, and image optimization.
        
    *   **Files**:
        
        *   src/app/layout.tsx: Update with optimization strategies
            
        *   next.config.js: Update with optimization settings
            
        *   src/lib/utils/image-optimization.ts: Image optimization utilities
            
    *   **Step Dependencies**: Multiple previous steps
        
    *   **User Instructions**: None
        

Deployment and Documentation
----------------------------

*   \[ \] Step 41: Deployment Configuration
    
    *   **Task**: Prepare the application for deployment.
        
    *   **Files**:
        
        *   .github/workflows/deploy.yml: GitHub Actions workflow
            
        *   next.config.js: Update for production
            
        *   README.md: Deployment instructions
            
    *   **Step Dependencies**: Step 40
        
    *   **User Instructions**: Set up a hosting account (e.g., Vercel) and connect it to your GitHub repository.
        
*   \[ \] Step 42: Documentation
    
    *   **Task**: Create comprehensive documentation for the application.
        
    *   **Files**:
        
        *   README.md: Project overview
            
        *   docs/installation.md: Installation guide
            
        *   docs/architecture.md: Architecture documentation
            
        *   docs/api.md: API documentation
            
    *   **Step Dependencies**: Step 41
        
    *   **User Instructions**: None
        

Summary
-------

This revised implementation plan leverages your existing Next.js 15.2 project with Tailwind CSS v4, Shadcn UI, and Supabase setup. The plan follows a logical progression starting with Supabase client configuration and authentication, then moving through database schema, shared components, and feature implementation.

Key advantages of this revised plan:

1.  **Builds on Existing Setup**: Leverages your existing project setup, reducing redundant configuration steps.
    
2.  **Uses Modern Stack**: Takes advantage of Next.js 15.2, React 19, and Tailwind CSS v4.
    
3.  **Organized Path**: Maintains a clear, step-by-step approach that builds features incrementally.
    
4.  **File Structure**: Adapts to your current src/ directory structure rather than assuming a root-level structure.
    

The implementation strategy remains consistent with the original plan:

1.  Start with authentication and database schema to establish a solid foundation.
    
2.  Build shared UI components for consistency across features.
    
3.  Implement main features incrementally, ensuring each builds upon previous work.
    
4.  Add refinements, testing, and optimization.
    

This approach gives you a structured roadmap to build the ContentCanvas application while making the most of your existing project setup.