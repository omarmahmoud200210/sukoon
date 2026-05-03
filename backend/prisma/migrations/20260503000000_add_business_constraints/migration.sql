-- 1. Prevent multiple active sessions per user
CREATE UNIQUE INDEX "one_active_session_per_user" 
ON "pomodoro_sessions"("user_id") 
WHERE "is_completed" = false;

-- 2. Prevent negative durations
ALTER TABLE "pomodoro_sessions" 
ADD CONSTRAINT "positive_duration" CHECK ("duration" > 0);

ALTER TABLE "pomodoro_tasks" 
ADD CONSTRAINT "positive_task_duration" CHECK ("duration" > 0);
