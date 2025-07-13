import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Mail, Phone, Clock, Home } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

export default function Contact() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t('contact.messageSent'),
      description: t('contact.messageSentDesc'),
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('contact.title')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {t('contact.address')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-gray-600">
                    <p className="font-semibold">IA-Solution</p>
                    <p>Domaine privé du Cap</p>
                    <p>Roquebrune-Cap-Martin 06190</p>
                    <p>Alpes-Maritimes, France</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    {t('contact.email')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a 
                    href="mailto:contact@ia-solution.fr" 
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    contact@ia-solution.fr
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    {t('contact.phone')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a 
                    href="tel:+33620478241" 
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    +33 620 478 241
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {t('contact.hours')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-gray-600">
                    <p>{t('contact.mondayFriday')}: 9h00 - 18h00</p>
                    <p>{t('contact.saturday')}: 9h00 - 12h00</p>
                    <p>{t('contact.sunday')}: {t('contact.closed')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>{t('contact.sendMessage')}</CardTitle>
                <CardDescription>
                  {t('contact.sendMessageDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">{t('contact.name')}</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder={t('contact.namePlaceholder')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">{t('contact.email')}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder={t('contact.emailPlaceholder')}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">{t('contact.subject')}</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder={t('contact.subjectPlaceholder')}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">{t('contact.message')}</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder={t('contact.messagePlaceholder')}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    {t('contact.sendButton')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}