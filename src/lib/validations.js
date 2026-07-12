import { z } from 'zod';

// Allowed image MIME types for upload
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

// Max file size: 5MB
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Project form validation schema
 */
export const projectSchema = z.object({
  title_vi: z
    .string()
    .min(2, 'Tên dự án tiếng Việt phải ít nhất 2 ký tự')
    .max(100, 'Tên dự án tối đa 100 ký tự'),
  title_en: z
    .string()
    .min(2, 'Project title must be at least 2 characters')
    .max(100, 'Project title max 100 characters'),
  description_vi: z
    .string()
    .min(10, 'Mô tả ít nhất 10 ký tự')
    .max(1000, 'Mô tả tối đa 1000 ký tự'),
  description_en: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description max 1000 characters'),
  category: z.enum(
    ['landing_page', 'portfolio', 'ecommerce', 'dashboard', 'web_app', 'other'],
    { message: 'Loại dự án không hợp lệ' }
  ),
  technologies: z
    .array(z.string().min(1).max(30))
    .min(1, 'Phải có ít nhất 1 công nghệ')
    .max(10, 'Tối đa 10 công nghệ'),
  thumbnail_url: z.string().url().optional().or(z.literal('')),
  demo_url: z.string().url().optional().or(z.literal('')),
  github_url: z.string().url().optional().or(z.literal('')),
  status: z.enum(['published', 'draft', 'coming_soon'], {
    message: 'Trạng thái không hợp lệ',
  }),
  featured: z.boolean().default(false),
});

/**
 * Contact form validation schema
 */
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Tên phải ít nhất 2 ký tự')
    .max(60, 'Tên tối đa 60 ký tự')
    .regex(/^[\p{L}\s'-]+$/u, 'Tên không hợp lệ'),
  email: z.string().email('Email không hợp lệ').max(100, 'Email quá dài'),
  subject: z
    .string()
    .min(3, 'Tiêu đề ít nhất 3 ký tự')
    .max(150, 'Tiêu đề tối đa 150 ký tự'),
  message: z
    .string()
    .min(10, 'Nội dung ít nhất 10 ký tự')
    .max(2000, 'Nội dung tối đa 2000 ký tự'),
});

/**
 * Login validation schema
 */
export const loginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});
