import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { redirect } from 'react-router';

export type UserType = 'fan' | 'performer' | 'venue_manager' | 'influencer' | 'admin';

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  userType: UserType;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  accountId: string;
  role: string;
}

/**
 * Create a new user with proper role assignment
 */
export async function createUserWithRole(
  request: Request,
  userData: CreateUserData
): Promise<AuthUser> {
  const supabase = getSupabaseServerAdminClient();

  // Create the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
  });

  if (authError) {
    throw new Error(`Authentication failed: ${authError.message}`);
  }

  if (!authData.user) {
    throw new Error('User creation failed');
  }

  const userId = authData.user.id;

  // Create personal account
  const { data: accountData, error: accountError } = await supabase
    .from('accounts')
    .insert({
      primary_owner_user_id: userId,
      name: userData.name,
      email: userData.email,
      is_personal_account: true,
    })
    .select()
    .single();

  if (accountError) {
    throw new Error(`Account creation failed: ${accountError.message}`);
  }

  // Create user profile with user type
  const { error: profileError } = await supabase
    .from('user_profiles')
    .insert({
      user_id: userId,
      name: userData.name,
      email: userData.email,
      user_type: userData.userType,
    });

  if (profileError) {
    throw new Error(`Profile creation failed: ${profileError.message}`);
  }

  // Assign role to account membership
  const { error: membershipError } = await supabase
    .from('accounts_memberships')
    .insert({
      user_id: userId,
      account_id: accountData.id,
      account_role: userData.userType,
    });

  if (membershipError) {
    throw new Error(`Role assignment failed: ${membershipError.message}`);
  }

  return {
    id: userId,
    email: userData.email,
    name: userData.name,
    userType: userData.userType,
    accountId: accountData.id,
    role: userData.userType,
  };
}

/**
 * Authenticate user and return user data with role
 */
export async function authenticateUser(request: Request): Promise<AuthUser | null> {
  const supabase = getSupabaseServerClient(request);

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Get user profile and account data
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('name, email, user_type')
    .eq('user_id', user.id)
    .single();

  if (!profile) {
    return null;
  }

  // Get account membership
  const { data: membership } = await supabase
    .from('accounts_memberships')
    .select('account_id, account_role')
    .eq('user_id', user.id)
    .single();

  if (!membership) {
    return null;
  }

  return {
    id: user.id,
    email: profile.email,
    name: profile.name,
    userType: profile.user_type as UserType,
    accountId: membership.account_id,
    role: membership.account_role,
  };
}

/**
 * Check if user has specific permission
 */
export async function hasPermission(
  request: Request,
  permission: string
): Promise<boolean> {
  const user = await authenticateUser(request);
  if (!user) return false;

  const supabase = getSupabaseServerClient(request);

  const { data } = await supabase
    .from('role_permissions')
    .select('permission')
    .eq('role', user.role)
    .eq('permission', permission)
    .single();

  return !!data;
}

/**
 * Check if user has specific role
 */
export async function hasRole(
  request: Request,
  role: string
): Promise<boolean> {
  const user = await authenticateUser(request);
  return user?.role === role;
}

/**
 * Require authentication - redirect if not authenticated
 */
export async function requireAuth(request: Request): Promise<AuthUser> {
  const user = await authenticateUser(request);
  if (!user) {
    throw redirect('/auth/sign-in');
  }
  return user;
}

/**
 * Require specific role - redirect if not authorized
 */
export async function requireRole(
  request: Request,
  requiredRole: string
): Promise<AuthUser> {
  const user = await requireAuth(request);
  if (user.role !== requiredRole) {
    throw redirect('/unauthorized');
  }
  return user;
}

/**
 * Require specific permission - redirect if not authorized
 */
export async function requirePermission(
  request: Request,
  permission: string
): Promise<AuthUser> {
  const user = await requireAuth(request);
  const hasAccess = await hasPermission(request, permission);
  if (!hasAccess) {
    throw redirect('/unauthorized');
  }
  return user;
}
