"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, FileText, HelpCircle, BookOpen, Zap, Download, Copy, RefreshCw } from "lucide-react"
import { generateQuizContent } from "@/app/actions/ai-actions"

export default function AIGeneratorPage() {
  const [inputText, setInputText] = useState("")
  const [contentType, setContentType] = useState("quiz")
  const [difficulty, setDifficulty] = useState("medium")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)

    try {
      if (contentType === "quiz") {
        const result = await generateQuizContent(inputText, difficulty, 3)

        if (result.success) {
          setGeneratedContent({
            type: "quiz",
            title: `${inputText} Quiz`,
            questions: result.quiz,
          })
        }
      }
      // Add similar logic for summary and flashcards
    } catch (error) {
      console.error("Error generating content:", error)
    } finally {
      setIsGenerating(false)
    }
  }

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
            <Badge variant="secondary">AI Generator</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Content Generator 🤖</h1>
          <p className="text-gray-600">Transform any text into engaging educational content instantly</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Input Content</span>
              </CardTitle>
              <CardDescription>
                Paste your text, upload an image, or enter a topic to generate educational content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="content">Source Content</Label>
                <Textarea
                  id="content"
                  placeholder="Paste your text here, or describe a topic you want to create content for..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] mt-2"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Content Type</Label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quiz">
                        <div className="flex items-center space-x-2">
                          <HelpCircle className="h-4 w-4" />
                          <span>Interactive Quiz</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="summary">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>Summary Notes</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="flashcards">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4" />
                          <span>Flashcards</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!inputText.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Generated Content</span>
                </div>
                {generatedContent && (
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                )}
              </CardTitle>
              <CardDescription>AI-generated educational content based on your input</CardDescription>
            </CardHeader>
            <CardContent>
              {!generatedContent ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <Brain className="h-16 w-16 mb-4 opacity-50" />
                  <p>Generated content will appear here</p>
                  <p className="text-sm">Enter some content and click generate to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedContent.type === "quiz" && (
                    <div>
                      <h3 className="text-xl font-bold mb-4">{generatedContent.title}</h3>
                      <div className="space-y-6">
                        {generatedContent.questions.map((q: any, index: number) => (
                          <Card key={index} className="border-l-4 border-l-purple-500">
                            <CardContent className="pt-4">
                              <h4 className="font-semibold mb-3">
                                {index + 1}. {q.question}
                              </h4>
                              <div className="space-y-2 mb-3">
                                {q.options.map((option: string, optIndex: number) => (
                                  <div
                                    key={optIndex}
                                    className={`p-2 rounded border ${optIndex === q.correct ? "bg-green-50 border-green-200" : "bg-gray-50"}`}
                                  >
                                    <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span> {option}
                                    {optIndex === q.correct && <Badge className="ml-2 bg-green-500">Correct</Badge>}
                                  </div>
                                ))}
                              </div>
                              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                                <p className="text-sm text-blue-800">
                                  <strong>Explanation:</strong> {q.explanation}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {generatedContent.type === "summary" && (
                    <div>
                      <h3 className="text-xl font-bold mb-4">{generatedContent.title}</h3>
                      <div className="prose prose-sm max-w-none">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: generatedContent.content
                              .replace(/\n/g, "<br>")
                              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                              .replace(/• /g, "• "),
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {generatedContent.type === "flashcards" && (
                    <div>
                      <h3 className="text-xl font-bold mb-4">{generatedContent.title}</h3>
                      <div className="grid gap-4">
                        {generatedContent.cards.map((card: any, index: number) => (
                          <Card key={index} className="border-l-4 border-l-blue-500">
                            <CardContent className="pt-4">
                              <Tabs defaultValue="front" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                  <TabsTrigger value="front">Front</TabsTrigger>
                                  <TabsTrigger value="back">Back</TabsTrigger>
                                </TabsList>
                                <TabsContent value="front" className="mt-4">
                                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                                    <p className="font-medium">{card.front}</p>
                                  </div>
                                </TabsContent>
                                <TabsContent value="back" className="mt-4">
                                  <div className="p-4 bg-blue-50 rounded-lg">
                                    <p>{card.back}</p>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
