import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useChatHistory(documentId: string) {
  return useQuery({
    queryKey: ['chat', documentId],
    queryFn: () => api.get(`/chat/${documentId}`),
    enabled: !!documentId,
  });
}

export function useSendMessage(documentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message: string) => api.post(`/chat/${documentId}`, { message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', documentId] });
    },
  });
}
