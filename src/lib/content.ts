import courseJson from '../../content/course.json';
import skillsJson from '../../content/skills.json';
import jobsJson from '../../content/jobs.json';
import type { Module, Track, Job } from './progress';

export const modules = courseJson.modules as Module[];
export const tracks = skillsJson as Track[];
export const jobs = jobsJson as Job[];
