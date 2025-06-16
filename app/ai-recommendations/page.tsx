"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Brain,
  Target,
  Clock,
  BookOpen,
  Zap,
  Star,
  Play,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Calendar,
} from "lucide-react"
import { generateCourseRecommendations, generateStudyPlan, analyzeStudentPerformance } from "@/app/actions/ai-actions"

export default function AIRecommendationsPage() {
  const [learningData, setLearningData] = useState({
    currentLevel: "Intermediate",
    learningStyle: "Visual",
    weakAreas: ["Calculus", "Data Structures"],
    strongAreas: ["Algebra", "Web Development"],
    timeAvailable: "2 hours/day",
    goals: ["Master Advanced Math", "Learn Machine Learning"],
  })

  const [recommendations, setRecommendations] = useState({
    courses: [],
    lectures: [],
    studyPlan: [],
    insights: [],
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAIRecommendations = async () => {
      try {
        const userData = localStorage.getItem("user")
        if (userData) {
          const user = JSON.parse(userData)

          // Generate real AI recommendations
          const recommendationsResult = await generateCourseRecommendations(user.id, learningData)

          if (recommendationsResult.success) {
            setRecommendations((prev) => ({
              ...prev,
              courses: recommendationsResult.recommendations,
            }))
          }

          // Generate study plan
          const studyPlanResult = await generateStudyPlan(learningData, "4-week")

          if (studyPlanResult.success) {
            setRecommendations((prev) => ({
              ...prev,
              studyPlan: studyPlanResult.studyPlan.weeks,
            }))
          }

          // Analyze performance
          const performanceResult = await analyzeStudentPerformance({
            currentLevel: learningData.currentLevel,
            weakAreas: learningData.weakAreas,
            strongAreas: learningData.strongAreas,
            recentScores: [85, 92, 78, 88, 95],
          })

          if (performanceResult.success) {
            setRecommendations((prev) => ({
              ...prev,
              insights: performanceResult.analysis.recommendations,
            }))
          }
        }
      } catch (error) {
        console.error("Error loading AI recommendations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAIRecommendations()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              EduMorph
            </span>
            <Badge variant="secondary">AI Recommendations</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Personalized Learning Path 🎯</h1>
          <p className="text-gray-600">AI-powered recommendations based on your learning profile and goals</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Brain className="h-16 w-16 text-purple-600 mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-semibold mb-2">AI is analyzing your learning profile...</h3>
              <p className="text-gray-600">This may take a few moments</p>
            </div>
          </div>
        ) : (
          <>
            {/* Learning Profile Summary */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Your Learning Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Current Level</h4>
                    <Badge className="bg-blue-100 text-blue-700">{learningData.currentLevel}</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Learning Style</h4>
                    <Badge className="bg-green-100 text-green-700">{learningData.learningStyle}</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Available Time</h4>
                    <Badge className="bg-purple-100 text-purple-700">{learningData.timeAvailable}</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Strong Areas</h4>
                    <div className="flex flex-wrap gap-1">
                      {learningData.strongAreas.map((area, index) => (
                        <Badge key={index} variant="outline" className="text-green-600 border-green-300">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Areas to Improve</h4>
                    <div className="flex flex-wrap gap-1">
                      {learningData.weakAreas.map((area, index) => (
                        <Badge key={index} variant="outline" className="text-orange-600 border-orange-300">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Goals</h4>
                    <div className="flex flex-wrap gap-1">
                      {learningData.goals.map((goal, index) => (
                        <Badge key={index} variant="outline" className="text-purple-600 border-purple-300">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="insights" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
                <TabsTrigger value="courses">Recommended Courses</TabsTrigger>
                <TabsTrigger value="lectures">Next Lectures</TabsTrigger>
                <TabsTrigger value="study-plan">Study Plan</TabsTrigger>
              </TabsList>

              <TabsContent value="insights">
                <div className="grid md:grid-cols-2 gap-6">
                  {recommendations.insights.map((insight, index) => (
                    <Alert
                      key={index}
                      className={`border-l-4 ${
                        insight.type === "strength"
                          ? "border-l-green-500 bg-green-50"
                          : insight.type === "opportunity"
                            ? "border-l-blue-500 bg-blue-50"
                            : insight.type === "warning"
                              ? "border-l-orange-500 bg-orange-50"
                              : "border-l-purple-500 bg-purple-50"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {insight.type === "strength" && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />}
                        {insight.type === "opportunity" && <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />}
                        {insight.type === "warning" && <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />}
                        {insight.type === "achievement" && <Star className="h-5 w-5 text-purple-600 mt-0.5" />}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{insight.title}</h4>
                            <Badge
                              variant={
                                insight.impact === "High"
                                  ? "destructive"
                                  : insight.impact === "Medium"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {insight.impact}
                            </Badge>
                          </div>
                          <AlertDescription className="mb-3">{insight.description}</AlertDescription>
                          <div className="p-2 bg-white rounded border">
                            <p className="text-sm font-medium">Recommended Action:</p>
                            <p className="text-sm text-gray-600">{insight.action}</p>
                          </div>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="courses">
                <div className="space-y-6">
                  {recommendations.courses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-semibold">{course.title}</h3>
                              <Badge className="bg-green-500 text-white">
                                <Zap className="h-3 w-3 mr-1" />
                                {course.match}% Match
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-3">{course.reason}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{course.duration}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span>{course.rating}</span>
                              </div>
                              <span>by {course.instructor}</span>
                              <Badge variant={course.difficulty === "Advanced" ? "destructive" : "default"}>
                                {course.difficulty}
                              </Badge>
                            </div>
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <strong>AI Insight:</strong> {course.aiInsight}
                              </p>
                            </div>
                          </div>
                          <div className="ml-6 text-center">
                            <p className="text-sm text-gray-600 mb-2">Available {course.nextAvailable}</p>
                            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                              Enroll Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="lectures">
                <div className="space-y-4">
                  {recommendations.lectures.map((lecture) => (
                    <Card key={lecture.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold">{lecture.title}</h3>
                              <Badge className="bg-green-500 text-white">
                                <Target className="h-3 w-3 mr-1" />
                                {lecture.aiMatch}% Match
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-2">{lecture.description}</p>
                            <p className="text-sm text-blue-600 mb-3">{lecture.reason}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{lecture.duration}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{lecture.scheduledFor}</span>
                              </div>
                              <span>by {lecture.instructor}</span>
                              <Badge variant="outline">{lecture.topic}</Badge>
                            </div>
                          </div>
                          <div className="ml-6">
                            <Button>
                              <Play className="h-4 w-4 mr-2" />
                              Join Lecture
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="study-plan">
                <div className="space-y-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">4-Week Personalized Study Plan</h2>
                    <p className="text-gray-600">Optimized for your 2 hours/day schedule and learning goals</p>
                  </div>

                  {recommendations.studyPlan.map((week) => (
                    <Card key={week.week}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center space-x-2">
                            <BookOpen className="h-5 w-5" />
                            <span>
                              Week {week.week}: {week.focus}
                            </span>
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant={week.priority === "High" ? "destructive" : "default"}>
                              {week.priority} Priority
                            </Badge>
                            <Badge variant="outline">{week.timeRequired}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {week.tasks.map((task, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-4 h-4 border-2 border-purple-300 rounded"></div>
                              <span className="flex-1">{task}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}
