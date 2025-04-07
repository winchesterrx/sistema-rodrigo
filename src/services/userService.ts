
import { supabase } from "../integrations/supabase/client";

export interface User {
  name: string;
  cpf: string;
  dateOfBirth: string;
  password: string;
  isAdmin?: boolean;
  permissions?: string[]; // Field for storing user permissions
}

// Get all users
export const getUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*');
    
    if (error) {
      console.error("Error fetching users:", error);
      return [];
    }
    
    // Transform Supabase data format to our app's User format
    return data.map(user => ({
      name: user.nome,
      cpf: user.cpf,
      dateOfBirth: user.data_nascimento,
      password: user.senha,
      isAdmin: user.is_admin,
      permissions: user.permissions
    }));
  } catch (error) {
    console.error("Error in getUsers:", error);
    return [];
  }
};

// Get user by CPF
export const getUserByCPF = async (cpf: string): Promise<User | undefined> => {
  const formattedCPF = cpf.replace(/\D/g, '');
  
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('cpf', formattedCPF)
      .single();
    
    if (error) {
      console.error("Error fetching user by CPF:", error);
      return undefined;
    }
    
    return {
      name: data.nome,
      cpf: data.cpf,
      dateOfBirth: data.data_nascimento,
      password: data.senha,
      isAdmin: data.is_admin,
      permissions: data.permissions
    };
  } catch (error) {
    console.error("Error in getUserByCPF:", error);
    return undefined;
  }
};

// Check if user has specific permission
export const hasPermission = (user: User, permission: string): boolean => {
  if (user.isAdmin) return true; // Admins have all permissions
  if (!user.permissions) return false;
  
  // O usuário com CPF 222.511.938-47 tem permissões específicas
  if (user.cpf.replace(/\D/g, '') === '22251193847') {
    return user.permissions.includes(permission) || user.permissions.includes("all");
  }
  
  return user.permissions.includes(permission) || user.permissions.includes("all");
};

// Save or update user
export const saveUser = async (user: User): Promise<boolean> => {
  // Ensure CPF is stored in clean format
  const cleanedCPF = user.cpf.replace(/\D/g, '');
  
  try {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('id')
      .eq('cpf', cleanedCPF)
      .single();
    
    if (existingUser) {
      // Update existing user
      const { error } = await supabase
        .from('usuarios')
        .update({
          nome: user.name,
          data_nascimento: user.dateOfBirth,
          senha: user.password,
          is_admin: user.isAdmin,
          permissions: user.permissions,
          updated_at: new Date()
        })
        .eq('cpf', cleanedCPF);
      
      if (error) {
        console.error("Error updating user:", error);
        return false;
      }
    } else {
      // Add new user
      const { error } = await supabase
        .from('usuarios')
        .insert({
          nome: user.name,
          cpf: cleanedCPF,
          data_nascimento: user.dateOfBirth,
          senha: user.password,
          is_admin: user.isAdmin || false,
          permissions: user.permissions || ['view']
        });
      
      if (error) {
        console.error("Error creating user:", error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error in saveUser:", error);
    return false;
  }
};

// Delete user
export const deleteUser = async (cpf: string): Promise<boolean> => {
  const cleanedCPF = cpf.replace(/\D/g, '');
  
  try {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('cpf', cleanedCPF);
    
    if (error) {
      console.error("Error deleting user:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return false;
  }
};

// Search users
export const searchUsers = async (term: string): Promise<User[]> => {
  if (!term) return getUsers();
  
  const lowerTerm = term.toLowerCase();
  
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .or(`nome.ilike.%${lowerTerm}%,cpf.ilike.%${lowerTerm}%`);
    
    if (error) {
      console.error("Error searching users:", error);
      return [];
    }
    
    return data.map(user => ({
      name: user.nome,
      cpf: user.cpf,
      dateOfBirth: user.data_nascimento,
      password: user.senha,
      isAdmin: user.is_admin,
      permissions: user.permissions
    }));
  } catch (error) {
    console.error("Error in searchUsers:", error);
    return [];
  }
};

// Update user password
export const updateUserPassword = async (cpf: string, currentPassword: string, newPassword: string): Promise<boolean> => {
  const cleanedCPF = cpf.replace(/\D/g, '');
  
  try {
    // First verify the current password
    const { data: user, error: fetchError } = await supabase
      .from('usuarios')
      .select('senha')
      .eq('cpf', cleanedCPF)
      .single();
    
    if (fetchError || !user) {
      console.error("Error fetching user for password update:", fetchError);
      return false;
    }
    
    if (user.senha !== currentPassword) {
      return false; // Current password doesn't match
    }
    
    // Update the password
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({ 
        senha: newPassword,
        updated_at: new Date()
      })
      .eq('cpf', cleanedCPF);
    
    if (updateError) {
      console.error("Error updating password:", updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateUserPassword:", error);
    return false;
  }
};

// Update user permissions
export const updateUserPermissions = async (cpf: string, permissions: string[]): Promise<boolean> => {
  const cleanedCPF = cpf.replace(/\D/g, '');
  
  try {
    const { error } = await supabase
      .from('usuarios')
      .update({ 
        permissions: permissions,
        updated_at: new Date()
      })
      .eq('cpf', cleanedCPF);
    
    if (error) {
      console.error("Error updating permissions:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateUserPermissions:", error);
    return false;
  }
};
