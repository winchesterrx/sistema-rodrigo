export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      aditivos_contrato: {
        Row: {
          contrato_id: string
          created_at: string | null
          data_assinatura: string
          data_fim_vigencia: string
          data_inicio_vigencia: string
          data_inscricao: string
          id: string
          indice_correcao: string | null
          numero: string
          tipo: string
          updated_at: string | null
          valor_complemento: number | null
        }
        Insert: {
          contrato_id: string
          created_at?: string | null
          data_assinatura: string
          data_fim_vigencia: string
          data_inicio_vigencia: string
          data_inscricao: string
          id?: string
          indice_correcao?: string | null
          numero: string
          tipo: string
          updated_at?: string | null
          valor_complemento?: number | null
        }
        Update: {
          contrato_id?: string
          created_at?: string | null
          data_assinatura?: string
          data_fim_vigencia?: string
          data_inicio_vigencia?: string
          data_inscricao?: string
          id?: string
          indice_correcao?: string | null
          numero?: string
          tipo?: string
          updated_at?: string | null
          valor_complemento?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "aditivos_contrato_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
        ]
      }
      contratos: {
        Row: {
          ano_contrato: string
          ano_indice: string | null
          codigo_ibge: string | null
          created_at: string | null
          data_assinatura: string
          data_contrato: string
          data_encerramento: string | null
          data_fim_vigencia: string
          data_inicio_vigencia: string
          data_publicacao: string | null
          id: string
          indice_correcao: string | null
          mes_indice: string | null
          modalidade_licitacao: string
          municipio: string
          nome_responsavel_contratante: string
          numero_contrato: string
          numero_processo_licitatorio: string
          qtde_habitantes: string | null
          responsavel: string
          sequencial: string | null
          situacao: string
          telefone_celular: string | null
          telefone_fixo: string | null
          tipo_contrato: string
          updated_at: string | null
          valor_contrato: number
        }
        Insert: {
          ano_contrato: string
          ano_indice?: string | null
          codigo_ibge?: string | null
          created_at?: string | null
          data_assinatura: string
          data_contrato: string
          data_encerramento?: string | null
          data_fim_vigencia: string
          data_inicio_vigencia: string
          data_publicacao?: string | null
          id?: string
          indice_correcao?: string | null
          mes_indice?: string | null
          modalidade_licitacao: string
          municipio: string
          nome_responsavel_contratante: string
          numero_contrato: string
          numero_processo_licitatorio: string
          qtde_habitantes?: string | null
          responsavel: string
          sequencial?: string | null
          situacao: string
          telefone_celular?: string | null
          telefone_fixo?: string | null
          tipo_contrato: string
          updated_at?: string | null
          valor_contrato: number
        }
        Update: {
          ano_contrato?: string
          ano_indice?: string | null
          codigo_ibge?: string | null
          created_at?: string | null
          data_assinatura?: string
          data_contrato?: string
          data_encerramento?: string | null
          data_fim_vigencia?: string
          data_inicio_vigencia?: string
          data_publicacao?: string | null
          id?: string
          indice_correcao?: string | null
          mes_indice?: string | null
          modalidade_licitacao?: string
          municipio?: string
          nome_responsavel_contratante?: string
          numero_contrato?: string
          numero_processo_licitatorio?: string
          qtde_habitantes?: string | null
          responsavel?: string
          sequencial?: string | null
          situacao?: string
          telefone_celular?: string | null
          telefone_fixo?: string | null
          tipo_contrato?: string
          updated_at?: string | null
          valor_contrato?: number
        }
        Relationships: []
      }
      documentos_contrato: {
        Row: {
          caminho_arquivo: string
          contrato_id: string
          created_at: string | null
          data: string
          historico: string
          id: string
          nome_arquivo: string
          tamanho_arquivo: number
          tipo_arquivo: string
          updated_at: string | null
        }
        Insert: {
          caminho_arquivo: string
          contrato_id: string
          created_at?: string | null
          data: string
          historico: string
          id?: string
          nome_arquivo: string
          tamanho_arquivo: number
          tipo_arquivo: string
          updated_at?: string | null
        }
        Update: {
          caminho_arquivo?: string
          contrato_id?: string
          created_at?: string | null
          data?: string
          historico?: string
          id?: string
          nome_arquivo?: string
          tamanho_arquivo?: number
          tipo_arquivo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentos_contrato_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
        ]
      }
      entidades_contrato: {
        Row: {
          cnpj: string
          contrato_id: string
          created_at: string | null
          id: string
          nome: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          cnpj: string
          contrato_id: string
          created_at?: string | null
          id?: string
          nome: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          cnpj?: string
          contrato_id?: string
          created_at?: string | null
          id?: string
          nome?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entidades_contrato_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
        ]
      }
      sistemas_contrato: {
        Row: {
          contrato_id: string
          created_at: string | null
          data_implantacao: string | null
          id: string
          implantado: boolean | null
          nome: string
          sigla: string
          status: string
          updated_at: string | null
          valor: number
        }
        Insert: {
          contrato_id: string
          created_at?: string | null
          data_implantacao?: string | null
          id?: string
          implantado?: boolean | null
          nome: string
          sigla: string
          status: string
          updated_at?: string | null
          valor: number
        }
        Update: {
          contrato_id?: string
          created_at?: string | null
          data_implantacao?: string | null
          id?: string
          implantado?: boolean | null
          nome?: string
          sigla?: string
          status?: string
          updated_at?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "sistemas_contrato_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          cpf: string
          created_at: string | null
          data_nascimento: string | null
          id: string
          is_admin: boolean | null
          nome: string
          permissions: string[] | null
          senha: string
          updated_at: string | null
        }
        Insert: {
          cpf: string
          created_at?: string | null
          data_nascimento?: string | null
          id?: string
          is_admin?: boolean | null
          nome: string
          permissions?: string[] | null
          senha: string
          updated_at?: string | null
        }
        Update: {
          cpf?: string
          created_at?: string | null
          data_nascimento?: string | null
          id?: string
          is_admin?: boolean | null
          nome?: string
          permissions?: string[] | null
          senha?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
