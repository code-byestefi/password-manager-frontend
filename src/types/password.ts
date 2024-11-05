export interface Password {
    id: number;
    name: string;
    username: string;
    websiteUrl?: string;
    notes?: string;
    categoryId?: number;
    categoryName?: string;
  }
  
  export interface CreatePasswordDTO {
    name: string;
    username: string;
    password: string;
    websiteUrl?: string;
    notes?: string;
    categoryId?: number;
  }

  export interface PasswordGeneratorConfig {
    length: number;
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeNumbers: boolean;
    includeSpecialChars: boolean;
  }
  
  export interface GeneratedPasswordDTO {
    password: string;
    strength: string;
    score: number;
  }