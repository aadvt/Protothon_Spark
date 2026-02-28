-- Create enums
CREATE TYPE user_role AS ENUM ('student', 'recruiter', 'admin');
CREATE TYPE verification_status AS ENUM ('verified', 'pending', 'rejected');
CREATE TYPE interview_status AS ENUM ('pending', 'scheduled', 'completed', 'cancelled');

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  user_role user_role NOT NULL DEFAULT 'student',
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create academics table
CREATE TABLE academics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  gpa DECIMAL(3,2) NOT NULL,
  graduation_year INTEGER NOT NULL,
  verification_status verification_status DEFAULT 'pending',
  frontend_skill INTEGER DEFAULT 0 CHECK (frontend_skill >= 0 AND frontend_skill <= 100),
  backend_skill INTEGER DEFAULT 0 CHECK (backend_skill >= 0 AND backend_skill <= 100),
  dsa_skill INTEGER DEFAULT 0 CHECK (dsa_skill >= 0 AND dsa_skill <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  description TEXT,
  required_skills JSONB DEFAULT '{"frontend": 0, "backend": 0, "dsa": 0}',
  min_experience INTEGER DEFAULT 0,
  salary_range VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create interviews table
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recruiter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  status interview_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create placement_audit table
CREATE TABLE placement_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  target_type VARCHAR(50),
  target_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_academics_student_id ON academics(student_id);
CREATE INDEX idx_jobs_recruiter_id ON jobs(recruiter_id);
CREATE INDEX idx_interviews_student_id ON interviews(student_id);
CREATE INDEX idx_interviews_recruiter_id ON interviews(recruiter_id);
CREATE INDEX idx_interviews_job_id ON interviews(job_id);
CREATE INDEX idx_placement_audit_admin_id ON placement_audit(admin_id);
CREATE INDEX idx_placement_audit_created_at ON placement_audit(created_at);
CREATE INDEX idx_profiles_user_role ON profiles(user_role);
