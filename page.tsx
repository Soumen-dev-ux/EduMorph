import Link from "next/link";
import {
  Button
} from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Badge
} from "@/components/ui/badge";
import {
  Brain,
  Users,
  Zap,
  Trophy,
  Mic,
  Eye
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-purple-600" aria-label="EduMorph Logo" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              EduMorph
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">
              Features
            </Link>
            <Link href="/courses" className="text-gray-600 hover:text-purple-600 transition-colors">
              Courses
            </Link>
            <Link href="/feedback" className="text-gray-600 hover:text-purple-600 transition-colors">
              Feedback
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-purple-600 transition-colors">
              About
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="py-20 px-4 text-center">
          <div className="container mx-auto">
            <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200">
              🚀 Revolutionizing Education with AI
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Learn Smarter,<br className="hidden md:block" /> Teach Better
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              EduMorph uses AI to create personalized learning experiences that adapt to every student's needs, making education more engaging, accessible, and effective.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-3"
                >
                  Start Learning Now
                </Button>
              </Link>
              <Link href="#demo">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                  Watch Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Powerful Features for Modern Learning</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our AI-powered platform combines the latest in educational technology to create personalized, engaging, and accessible learning experiences.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Brain className="h-12 w-12 text-purple-600 mb-4" />,
                  title: "AI-Powered Personalization",
                  desc: "Adaptive learning paths that adjust to each student's pace, learning style, and knowledge gaps."
                },
                {
                  icon: <Trophy className="h-12 w-12 text-blue-600 mb-4" />,
                  title: "Gamified Learning",
                  desc: "Levels, badges, leaderboards, and achievements that make learning fun and motivating."
                },
                {
                  icon: <Eye className="h-12 w-12 text-green-600 mb-4" />,
                  title: "Accessibility First",
                  desc: "Text-to-speech, high contrast modes, and multilingual support for inclusive learning."
                },
                {
                  icon: <Zap className="h-12 w-12 text-orange-600 mb-4" />,
                  title: "Instant Content Generation",
                  desc: "AI generates quizzes, summaries, and flashcards from any text or image content."
                },
                {
                  icon: <Users className="h-12 w-12 text-red-600 mb-4" />,
                  title: "Teacher Dashboard",
                  desc: "Real-time insights, progress tracking, and automated feedback generation for educators."
                },
                {
                  icon: <Mic className="h-12 w-12 text-indigo-600 mb-4" />,
                  title: "Voice Assistant",
                  desc: "Voice-activated learning assistant for hands-free interaction and accessibility."
                }
              ].map((feature, i) => (
                <Card key={i} className="border-2 hover:border-purple-200 transition-colors">
                  <CardHeader>
                    {feature.icon}
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.desc}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="container mx-auto grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "95%", label: "Student Engagement" },
              { value: "3x", label: "Faster Learning" },
              { value: "50+", label: "Languages Supported" },
              { value: "24/7", label: "AI Assistant" }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-purple-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gray-50 text-center">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Learning Experience?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of students and teachers who are already using EduMorph to achieve better learning outcomes.
            </p>
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-3"
              >
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6" />
            <span className="text-xl font-bold">EduMorph</span>
          </div>
          <div className="text-gray-400">
            © {new Date().getFullYear()} EduMorph. Revolutionizing education with AI.
          </div>
        </div>
      </footer>
    </div>
  );
}
