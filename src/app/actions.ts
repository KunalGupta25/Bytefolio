/**
 * Barrel re-export for all server actions.
 * The actual implementations live in src/app/actions/*.ts — each has 'use server'.
 * This barrel does NOT need 'use server' since it only re-exports from modules that do.
 * All existing imports from '@/app/actions' continue to work unchanged.
 */

export * from './actions/auth-actions';
export * from './actions/about-actions';
export * from './actions/site-actions';
export * from './actions/skill-actions';
export * from './actions/education-actions';
export * from './actions/project-actions';
export * from './actions/certification-actions';
export * from './actions/contact-actions';
export * from './actions/analytics-actions';
export * from './actions/resume-actions';
