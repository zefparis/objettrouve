import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { fr, enUS, es, ptBR, it, de, nl, zhCN, ja, ko } from "date-fns/locale";
import { MessageCircle, Search, Home } from "lucide-react";

const locales = {
  fr,
  en: enUS,
  es,
  pt: ptBR,
  it,
  de,
  nl,
  zh: zhCN,
  ja,
  ko
};

export default function Conversations() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const currentLocale = locales[i18n.language as keyof typeof locales] || enUS;

  const { data: conversations, isLoading } = useQuery({
    queryKey: ["/api/conversations"],
    queryFn: async () => {
      const response = await fetch("/api/conversations");
      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              {t('common.backToHome')}
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('chat.title')}
          </h1>
          <p className="text-gray-600">
            {t('chat.conversationsDesc') || 'Manage your conversations about lost and found items'}
          </p>
        </div>

        {/* Conversations List */}
        {!conversations || conversations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {t('chat.noConversations') || 'No conversations yet'}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('chat.noConversationsDesc') || 'Start a conversation by contacting someone about their lost or found item'}
              </p>
              <Link href="/search">
                <Button>
                  <Search className="w-4 h-4 mr-2" />
                  {t('nav.search')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation: any) => (
              <Link key={conversation.itemId} href={`/chat/${conversation.itemId}`}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarImage src={conversation.otherUser?.profileImageUrl} />
                        <AvatarFallback>
                          {conversation.otherUser?.firstName?.[0] || 
                           conversation.otherUser?.email?.[0] || 
                           "U"}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {conversation.otherUser?.firstName && conversation.otherUser?.lastName
                              ? `${conversation.otherUser.firstName} ${conversation.otherUser.lastName}`
                              : conversation.otherUser?.email || t('chat.anonymousUser')}
                          </h3>
                          <time className="text-sm text-gray-500 flex-shrink-0">
                            {formatDistance(new Date(conversation.lastMessage.createdAt), new Date(), {
                              addSuffix: true,
                              locale: currentLocale
                            })}
                          </time>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant={conversation.item.type === 'lost' ? 'destructive' : 'success'}>
                            {conversation.item.type === 'lost' ? t('publishNew.type.lost') : t('publishNew.type.found')}
                          </Badge>
                          <span className="text-sm text-gray-600 truncate">
                            {conversation.item.title}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage.senderId === user?.id ? 
                            `${t('chat.you')}: ${conversation.lastMessage.content}` : 
                            conversation.lastMessage.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}