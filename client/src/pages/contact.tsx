import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Link } from "wouter";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  MessageCircle,
  HelpCircle,
  Bug,
  Star,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowLeft,
  Home
} from "lucide-react";

export default function Contact() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: t('contact.form.success'),
        description: t('contact.form.successMessage'),
      });
      setFormData({ name: '', email: '', subject: '', category: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: t('contact.methods.email.title'),
      description: t('contact.methods.email.description'),
      value: "support@objetstrouves.fr",
      action: t('contact.methods.email.action')
    },
    {
      icon: Phone,
      title: t('contact.methods.phone.title'),
      description: t('contact.methods.phone.description'),
      value: "+33 1 23 45 67 89",
      action: t('contact.methods.phone.action')
    },
    {
      icon: MapPin,
      title: t('contact.methods.address.title'),
      description: t('contact.methods.address.description'),
      value: "123 Rue de la Paix, 75001 Paris, France",
      action: t('contact.methods.address.action')
    },
    {
      icon: Clock,
      title: t('contact.methods.hours.title'),
      description: t('contact.methods.hours.description'),
      value: t('contact.methods.hours.value'),
      action: t('contact.methods.hours.action')
    }
  ];

  const faqItems = [
    {
      question: t('contact.faq.item1.question'),
      answer: t('contact.faq.item1.answer')
    },
    {
      question: t('contact.faq.item2.question'),
      answer: t('contact.faq.item2.answer')
    },
    {
      question: t('contact.faq.item3.question'),
      answer: t('contact.faq.item3.answer')
    },
    {
      question: t('contact.faq.item4.question'),
      answer: t('contact.faq.item4.answer')
    }
  ];

  const socialLinks = [
    { icon: Facebook, name: 'Facebook', url: 'https://facebook.com' },
    { icon: Twitter, name: 'Twitter', url: 'https://twitter.com' },
    { icon: Instagram, name: 'Instagram', url: 'https://instagram.com' },
    { icon: Linkedin, name: 'LinkedIn', url: 'https://linkedin.com' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 pt-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
        </Link>
      </div>
      
      <div className="container mx-auto px-4 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            {t('contact.badge')}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <Card className="p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl flex items-center">
                <MessageCircle className="w-6 h-6 mr-2 text-blue-500" />
                {t('contact.form.title')}
              </CardTitle>
              <CardDescription>
                {t('contact.form.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('contact.form.name')} *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder={t('contact.form.namePlaceholder')}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('contact.form.email')} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder={t('contact.form.emailPlaceholder')}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">{t('contact.form.category')} *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('contact.form.categoryPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">{t('contact.form.categories.general')}</SelectItem>
                      <SelectItem value="technical">{t('contact.form.categories.technical')}</SelectItem>
                      <SelectItem value="billing">{t('contact.form.categories.billing')}</SelectItem>
                      <SelectItem value="feedback">{t('contact.form.categories.feedback')}</SelectItem>
                      <SelectItem value="report">{t('contact.form.categories.report')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">{t('contact.form.subject')} *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder={t('contact.form.subjectPlaceholder')}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{t('contact.form.message')} *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder={t('contact.form.messagePlaceholder')}
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('contact.form.sending')}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {t('contact.form.send')}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl">
                  {t('contact.info.title')}
                </CardTitle>
                <CardDescription>
                  {t('contact.info.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-6">
                  {contactMethods.map((method, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                        <method.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{method.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                          {method.description}
                        </p>
                        <p className="font-medium text-blue-600 dark:text-blue-400">
                          {method.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl">
                  {t('contact.social.title')}
                </CardTitle>
                <CardDescription>
                  {t('contact.social.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                    >
                      <social.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
              <HelpCircle className="w-8 h-8 mr-3 text-blue-500" />
              {t('contact.faq.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('contact.faq.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {faqItems.map((item, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-lg">{item.question}</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <p className="text-gray-600 dark:text-gray-300">
                    {item.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-8 text-center">
          <CardContent className="px-0">
            <h2 className="text-2xl font-bold mb-4 flex items-center justify-center">
              <Bug className="w-6 h-6 mr-2" />
              {t('contact.emergency.title')}
            </h2>
            <p className="text-lg mb-6 opacity-90">
              {t('contact.emergency.description')}
            </p>
            <Button variant="secondary" size="lg" className="text-red-600">
              <Phone className="w-5 h-5 mr-2" />
              {t('contact.emergency.button')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}