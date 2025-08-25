-- Migration para criar tabela n8n_chat_histories
-- Execute esta query no editor SQL do Supabase

-- Criação da tabela principal
CREATE TABLE IF NOT EXISTS n8n_chat_histories (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    message JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_n8n_chat_session_id ON n8n_chat_histories(session_id);
CREATE INDEX IF NOT EXISTS idx_n8n_chat_created_at ON n8n_chat_histories(created_at);
CREATE INDEX IF NOT EXISTS idx_n8n_chat_message_type ON n8n_chat_histories USING GIN ((message->>'type'));

-- RLS (Row Level Security) policies
ALTER TABLE n8n_chat_histories ENABLE ROW LEVEL SECURITY;

-- Policy para permitir que usuários vejam apenas suas próprias mensagens
CREATE POLICY "Users can view own chat history" ON n8n_chat_histories
    FOR SELECT USING (auth.uid()::text = session_id);

-- Policy para permitir que usuários insiram suas próprias mensagens
CREATE POLICY "Users can insert own messages" ON n8n_chat_histories
    FOR INSERT WITH CHECK (auth.uid()::text = session_id);

-- Policy para permitir que usuários deletem suas próprias mensagens
CREATE POLICY "Users can delete own messages" ON n8n_chat_histories
    FOR DELETE USING (auth.uid()::text = session_id);

-- Comentários para documentação
COMMENT ON TABLE n8n_chat_histories IS 'Histórico de conversas do chat integrado com N8N';
COMMENT ON COLUMN n8n_chat_histories.session_id IS 'ID do usuário/sessão (UUID do Supabase Auth)';
COMMENT ON COLUMN n8n_chat_histories.message IS 'Mensagem no formato JSON do LangChain';
COMMENT ON COLUMN n8n_chat_histories.created_at IS 'Timestamp da criação da mensagem';

-- Função para limpeza automática de mensagens antigas (opcional)
CREATE OR REPLACE FUNCTION cleanup_old_chat_messages()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Remove mensagens com mais de 90 dias
    DELETE FROM n8n_chat_histories 
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$;

-- Comentário na função
COMMENT ON FUNCTION cleanup_old_chat_messages() IS 'Remove mensagens de chat com mais de 90 dias para economizar espaço';

-- Exemplo de como chamar a função de limpeza (manual)
-- SELECT cleanup_old_chat_messages();

-- View para estatísticas rápidas (opcional)
CREATE OR REPLACE VIEW chat_stats AS
SELECT 
    session_id,
    COUNT(*) as total_messages,
    COUNT(*) FILTER (WHERE message->>'type' = 'human') as user_messages,
    COUNT(*) FILTER (WHERE message->>'type' = 'ai') as ai_messages,
    MIN(created_at) as first_message,
    MAX(created_at) as last_message
FROM n8n_chat_histories
GROUP BY session_id;

COMMENT ON VIEW chat_stats IS 'Estatísticas de chat por usuário/sessão';
