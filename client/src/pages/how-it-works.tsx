import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Search, 
  MessageCircle, 
  Shield, 
  Users, 
  MapPin, 
  Clock,
  CheckCircle,
  ArrowRight,
  Upload,
  Filter,
  Bell,
  ArrowLeft,
  Home
} from "lucide-react";

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      id: 1,
      icon: Upload,
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.description'),
      details: [
        t('howItWorks.step1.detail1'),
        t('howItWorks.step1.detail2'),
        t('howItWorks.step1.detail3')
      ]
    },
    {
      id: 2,
      icon: Search,
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.description'),
      details: [
        t('howItWorks.step2.detail1'),
        t('howItWorks.step2.detail2'),
        t('howItWorks.step2.detail3')
      ]
    },
    {
      id: 3,
      icon: MessageCircle,
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.description'),
      details: [
        t('howItWorks.step3.detail1'),
        t('howItWorks.step3.detail2'),
        t('howItWorks.step3.detail3')
      ]
    }
  ];

  const features = [
    {
      icon: Shield,
      title: t('howItWorks.features.security.title'),
      description: t('howItWorks.features.security.description')
    },
    {
      icon: MapPin,
      title: t('howItWorks.features.location.title'),
      description: t('howItWorks.features.location.description')
    },
    {
      icon: Bell,
      title: t('howItWorks.features.notifications.title'),
      description: t('howItWorks.features.notifications.description')
    },
    {
      icon: Users,
      title: t('howItWorks.features.community.title'),
      description: t('howItWorks.features.community.description')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
        </Link>
      </div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            {t('howItWorks.badge')}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('howItWorks.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* Main Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              <Card className="h-full hover:shadow-xl transition-shadow duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-700">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-16 h-16 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center justify-center mb-2">
                    <Badge variant="secondary" className="mr-2">
                      {t('howItWorks.stepNumber', { number: step.id })}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-blue-500" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('howItWorks.features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-14 h-14 flex items-center justify-center">
                    <feature.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('howItWorks.timeline.title')}
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200 dark:bg-blue-700"></div>
              {[
                {
                  time: t('howItWorks.timeline.immediate'),
                  title: t('howItWorks.timeline.step1.title'),
                  description: t('howItWorks.timeline.step1.description')
                },
                {
                  time: t('howItWorks.timeline.minutes'),
                  title: t('howItWorks.timeline.step2.title'),
                  description: t('howItWorks.timeline.step2.description')
                },
                {
                  time: t('howItWorks.timeline.hours'),
                  title: t('howItWorks.timeline.step3.title'),
                  description: t('howItWorks.timeline.step3.description')
                }
              ].map((item, index) => (
                <div key={index} className={`flex items-center mb-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="p-6">
                      <div className="flex items-center mb-2">
                        <Clock className="w-5 h-5 text-blue-500 mr-2" />
                        <Badge variant="outline">{item.time}</Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                    </Card>
                  </div>
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-gray-800 z-10"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            {t('howItWorks.cta.title')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('howItWorks.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/publish">
              <Button size="lg" variant="secondary" className="text-blue-600">
                {t('howItWorks.cta.publishButton')}
              </Button>
            </Link>
            <Link href="/search">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                {t('howItWorks.cta.searchButton')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}