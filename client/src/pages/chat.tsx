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
import { Send, ArrowLeft, MoreVertical, Phone, Video, Info, Flag } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
      // Determine receiver ID: if current user is item owner, find the other participant
      let receiverId = item.userId;
      if (item.userId === user?.id && messages && messages.length > 0) {
        // Find the other participant in the conversation
        const otherParticipant = messages.find(msg => msg.senderId !== user.id);
        if (otherParticipant) {
          receiverId = otherParticipant.senderId;
        }
      }
      
      return await apiRequest("POST", "/api/messages", {
        itemId: parseInt(itemId!),
        receiverId,
        content,
      });
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", itemId] });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      toast({
        title: t("chat.messageSent") || "Message envoyé",
        description: t("chat.messageSentDesc") || "Votre message a été envoyé avec succès",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: t("common.error") || "Erreur",
        description: t("chat.messageError") || "Erreur lors de l'envoi du message",
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
              <Button onClick={() => window.location.href = "/conversations"}>
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
          <CardHeader className="flex-shrink-0 border-b bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = "/conversations"}
                  className="hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={item?.user?.profileImageUrl} />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {item?.user?.firstName?.[0] || item?.user?.email?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {item?.title || t("chat.conversation")}
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-500">{t("chat.online")}</span>
                      </div>
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
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                  <Video className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Info className="h-4 w-4 mr-2" />
                      {t("chat.itemDetails")}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Flag className="h-4 w-4 mr-2" />
                      {t("chat.reportUser")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-gray-500 text-sm">{t("chat.loadingMessages")}</p>
                    </div>
                  </div>
                ) : messages && messages.length > 0 ? (
                  messages.map((msg: any) => {
                    const isOwnMessage = msg.senderId === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group`}
                      >
                        <div className={`flex items-end space-x-2 ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          {!isOwnMessage && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={item?.user?.profileImageUrl} />
                              <AvatarFallback className="bg-gray-400 text-white text-xs">
                                {item?.user?.firstName?.[0] || item?.user?.email?.[0] || '?'}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                              isOwnMessage
                                ? 'bg-blue-500 text-white rounded-br-md'
                                : 'bg-white text-gray-900 rounded-bl-md border'
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
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center bg-white p-8 rounded-lg shadow-sm">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 mb-2 font-medium">{t("chat.noMessages")}</p>
                      <p className="text-gray-400 text-sm">
                        {t("chat.startConversation")}
                      </p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="flex-shrink-0 border-t p-4 bg-white">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t("chat.typePlaceholder")}
                      className="pr-20 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      disabled={sendMessageMutation.isPending}
                    />
                    {sendMessageMutation.isPending && (
                      <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={!message.trim() || sendMessageMutation.isPending}
                    className="rounded-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                {sendMessageMutation.isPending && (
                  <p className="text-xs text-gray-500 mt-1">{t("chat.typing")}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
