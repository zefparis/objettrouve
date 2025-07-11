import { useState, useEffect, useRef } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Send, ArrowLeft } from "lucide-react";

export default function Chat() {
  const { t, i18n } = useTranslation();
  const { itemId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: item } = useQuery({
    queryKey: ["/api/items", itemId],
    queryFn: async () => {
      const response = await fetch(`/api/items/${itemId}`);
      if (!response.ok) {
        throw new Error("Item not found");
      }
      return response.json();
    },
    enabled: !!itemId,
  });

  const { data: messages, isLoading } = useQuery({
    queryKey: ["/api/conversations", itemId],
    queryFn: async () => {
      const response = await fetch(`/api/conversations/${itemId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      return response.json();
    },
    enabled: !!itemId,
    refetchInterval: 5000, // Refresh messages every 5 seconds
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return await apiRequest("POST", "/api/messages", {
        itemId: parseInt(itemId!),
        receiverId: item.userId === user?.id ? messages?.[0]?.senderId : item.userId,
        content,
      });
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", itemId] });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
    onError: (error) => {
      toast({
        title: t("common.error"),
        description: t("chat.messageError"),
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!itemId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("chat.conversationNotFound")}
              </h2>
              <p className="text-gray-600 mb-6">
                {t("chat.selectValidConversation")}
              </p>
              <Button onClick={() => window.location.href = "/dashboard"}>
                {t("chat.backToDashboard")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="flex-shrink-0 border-b">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = "/dashboard"}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <CardTitle className="text-lg">
{item?.title || t("chat.conversation")}
                </CardTitle>
                {item && (
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={item.type === "lost" ? "destructive" : "secondary"}>
                      {item.type === "lost" ? t("search.itemType.lost") : t("search.itemType.found")}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {item.location}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : messages && messages.length > 0 ? (
                  messages.map((msg: any) => {
                    const isOwnMessage = msg.senderId === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isOwnMessage
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {new Date(msg.createdAt).toLocaleTimeString(i18n.language, {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-gray-500 mb-2">{t("chat.noMessages")}</p>
                      <p className="text-gray-400 text-sm">
{t("chat.startConversation")}
                      </p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="flex-shrink-0 border-t p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t("chat.typePlaceholder")}
                    className="flex-1"
                    disabled={sendMessageMutation.isPending}
                  />
                  <Button
                    type="submit"
                    disabled={!message.trim() || sendMessageMutation.isPending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
