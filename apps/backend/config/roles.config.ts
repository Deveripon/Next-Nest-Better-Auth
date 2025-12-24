import { Permission, Role } from '@prisma/client';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: [
    // User Management
    Permission.MANAGE_USERS,
    Permission.VIEW_USERS,
    Permission.CREATE_USER,
    Permission.UPDATE_USER,
    Permission.DELETE_USER,

    // Content Management
    Permission.CREATE_CONTENT,
    Permission.VIEW_CONTENT,
    Permission.EDIT_CONTENT,
    Permission.DELETE_CONTENT,

    // Category Management
    Permission.CREATE_CATEGORY,
    Permission.VIEW_CATEGORIES,
    Permission.EDIT_CATEGORY,
    Permission.DELETE_CATEGORY,

    // Media Management
    Permission.UPLOAD_MEDIA,
    Permission.MANAGE_MEDIA,
    Permission.VIEW_MEDIA,

    // Client/Lead Management
    Permission.VIEW_LEADS,
    Permission.EDIT_LEAD,
    Permission.DELETE_LEAD,
    Permission.VIEW_ENQUIRIES,
    Permission.DELETE_ENQUIRY,
    Permission.REPLY_ENQUIRY,

    // Financial/Order Management
    Permission.VIEW_ORDERS,
    Permission.EDIT_ORDER,
    Permission.DELETE_ORDER,
    Permission.VIEW_PAYMENTS,
    Permission.EDIT_PAYMENT,
    Permission.DELETE_PAYMENT,

    // Profile Management
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,

    // Settings Management
    Permission.MANAGE_SETTINGS,
    Permission.VIEW_SETTINGS,

    // Analytics & Reports
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_DATA,

    // System Administration
    Permission.BULK_OPERATIONS,
    Permission.MANAGE_SYSTEM,
  ],

  [Role.ADMIN]: [
    Permission.MANAGE_USERS,
    Permission.VIEW_USERS,
    Permission.CREATE_USER,
    Permission.UPDATE_USER,
    Permission.DELETE_USER,

    Permission.CREATE_CONTENT,
    Permission.VIEW_CONTENT,
    Permission.EDIT_CONTENT,
    Permission.DELETE_CONTENT,

    Permission.CREATE_CATEGORY,
    Permission.VIEW_CATEGORIES,
    Permission.EDIT_CATEGORY,
    Permission.DELETE_CATEGORY,

    Permission.UPLOAD_MEDIA,
    Permission.MANAGE_MEDIA,
    Permission.VIEW_MEDIA,

    Permission.VIEW_LEADS,
    Permission.EDIT_LEAD,
    Permission.DELETE_LEAD,
    Permission.VIEW_ENQUIRIES,
    Permission.DELETE_ENQUIRY,
    Permission.REPLY_ENQUIRY,

    Permission.VIEW_ORDERS,
    Permission.EDIT_ORDER,
    Permission.VIEW_PAYMENTS,
    Permission.EDIT_PAYMENT,

    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,

    Permission.VIEW_SETTINGS,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_DATA,
    Permission.BULK_OPERATIONS,
  ],

  [Role.MANAGER]: [
    Permission.VIEW_USERS,

    Permission.CREATE_CONTENT,
    Permission.VIEW_CONTENT,
    Permission.EDIT_CONTENT,
    Permission.DELETE_CONTENT,

    Permission.CREATE_CATEGORY,
    Permission.VIEW_CATEGORIES,
    Permission.EDIT_CATEGORY,
    Permission.DELETE_CATEGORY,

    Permission.UPLOAD_MEDIA,
    Permission.MANAGE_MEDIA,
    Permission.VIEW_MEDIA,

    Permission.VIEW_LEADS,
    Permission.EDIT_LEAD,
    Permission.VIEW_ENQUIRIES,
    Permission.REPLY_ENQUIRY,

    Permission.VIEW_ORDERS,
    Permission.VIEW_PAYMENTS,

    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,

    Permission.VIEW_ANALYTICS,
  ],

  [Role.USER]: [
    Permission.VIEW_CONTENT,
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
  ],

  [Role.GUEST]: [Permission.VIEW_CONTENT],
};
