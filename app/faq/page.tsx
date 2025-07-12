'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
  ArrowLeft,
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Book,
  CreditCard,
  Monitor,
  Loader2,
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = [
    { id: 'all', name: 'All Topics', icon: <Book className="h-5 w-5" /> },
    { id: 'getting-started', name: 'Getting Started', icon: <HelpCircle className="h-5 w-5" /> },
    { id: 'payments', name: 'Payments & Payouts', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'obs', name: 'OBS Integration', icon: <Monitor className="h-5 w-5" /> },
    { id: 'account', name: 'Account & Settings', icon: <MessageCircle className="h-5 w-5" /> },
  ];

  // Fetch FAQs from database
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }
        if (searchQuery) {
          params.append('search', searchQuery);
        }

        const response = await fetch(`/api/v1/faq?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setFaqs(data.data);
          setError('');
        } else {
          setError('Failed to load FAQs');
        }
      } catch (err) {
        setError('Failed to load FAQs');
        console.error('FAQ fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchFAQs, 300);
    return () => clearTimeout(debounceTimer);
  }, [selectedCategory, searchQuery]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => (prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]));
  };

  // Since filtering is now done on the server side via API params,
  // we can use faqs directly as filteredFAQs
  const filteredFAQs = faqs;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              SocialBuzz
            </Link>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <HelpCircle className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about using SocialBuzz
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600'
                          : 'text-gray-700'
                      }`}
                    >
                      {category.icon}
                      <span className="ml-3 font-medium">{category.name}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/contact" className="block text-indigo-600 hover:text-indigo-800">
                  Contact Support
                </Link>
                <Link href="/terms" className="block text-indigo-600 hover:text-indigo-800">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="block text-indigo-600 hover:text-indigo-800">
                  Privacy Policy
                </Link>
                <Link href="/about" className="block text-indigo-600 hover:text-indigo-800">
                  About SocialBuzz
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedCategory === 'all' ? 'All Topics' : categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <p className="text-gray-600">
                {filteredFAQs.length} {filteredFAQs.length === 1 ? 'question' : 'questions'} found
              </p>
            </div>

            {loading ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Loader2 className="h-12 w-12 text-indigo-600 mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Loading FAQs...</h3>
                  <p className="text-gray-600">Please wait while we fetch the latest questions and answers</p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card>
                <CardContent className="text-center py-12">
                  <HelpCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading FAQs</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>Try Again</Button>
                </CardContent>
              </Card>
            ) : filteredFAQs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">Try adjusting your search terms or browse different categories</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map(faq => (
                  <Card key={faq.id} className="overflow-hidden">
                    <button onClick={() => toggleExpanded(faq.id)} className="w-full text-left">
                      <CardHeader className="hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-medium text-gray-900 pr-4">{faq.question}</CardTitle>
                          {expandedItems.includes(faq.id) ? (
                            <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          )}
                        </div>
                      </CardHeader>
                    </button>

                    {expandedItems.includes(faq.id) && (
                      <CardContent>
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <Card className="mt-12 border-indigo-200 bg-indigo-50">
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">Still need help?</h3>
            <p className="text-indigo-700 mb-6">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact">
                <Button className="bg-indigo-600 hover:bg-indigo-700">Contact Support</Button>
              </Link>
              <Button
                variant="outline"
                className="border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white"
              >
                Send Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
