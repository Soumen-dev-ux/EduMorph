"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Eye, Volume2, Keyboard, Brain, Play, Pause, SkipForward, SkipBack } from "lucide-react"

export default function AccessibilityPage() {
  const [settings, setSettings] = useState({
    highContrast: false,
    fontSize: [16],
    textToSpeech: false,
    voiceSpeed: [1],
    language: "en",
    reducedMotion: false,
    keyboardNav: true,
    screenReader: false,
    dyslexiaFont: false,
    colorBlindMode: "none",
  })

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentText, setCurrentText] = useState(
    "Welcome to EduMorph's accessibility features. These tools are designed to make learning accessible for everyone.",
  )

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
    // In a real app, this would control text-to-speech
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        settings.highContrast ? "bg-black text-white" : "bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100"
      }`}
    >
      {/* Header */}
      <header
        className={`border-b sticky top-0 z-50 transition-all duration-300 ${
          settings.highContrast ? "bg-black border-white" : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-purple-600" />
            <span
              className={`text-2xl font-bold ${
                settings.highContrast
                  ? "text-white"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
              }`}
            >
              EduMorph
            </span>
            <Badge variant="secondary">Accessibility Center</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 ${settings.dyslexiaFont ? "font-mono" : ""}`}
            style={{ fontSize: `${settings.fontSize[0] * 1.5}px` }}
          >
            Accessibility Center ♿
          </h1>
          <p
            className={`${settings.highContrast ? "text-gray-300" : "text-gray-600"}`}
            style={{ fontSize: `${settings.fontSize[0]}px` }}
          >
            Customize your learning experience with our accessibility tools
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Visual Settings */}
            <Card className={settings.highContrast ? "bg-gray-900 border-gray-700" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Visual Settings</span>
                </CardTitle>
                <CardDescription className={settings.highContrast ? "text-gray-400" : ""}>
                  Adjust visual elements for better readability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="high-contrast">High Contrast Mode</Label>
                  <Switch
                    id="high-contrast"
                    checked={settings.highContrast}
                    onCheckedChange={(checked) => updateSetting("highContrast", checked)}
                  />
                </div>

                <div>
                  <Label>Font Size: {settings.fontSize[0]}px</Label>
                  <Slider
                    value={settings.fontSize}
                    onValueChange={(value) => updateSetting("fontSize", value)}
                    max={24}
                    min={12}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="dyslexia-font">Dyslexia-Friendly Font</Label>
                  <Switch
                    id="dyslexia-font"
                    checked={settings.dyslexiaFont}
                    onCheckedChange={(checked) => updateSetting("dyslexiaFont", checked)}
                  />
                </div>

                <div>
                  <Label>Color Blind Support</Label>
                  <Select
                    value={settings.colorBlindMode}
                    onValueChange={(value) => updateSetting("colorBlindMode", value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="protanopia">Protanopia</SelectItem>
                      <SelectItem value="deuteranopia">Deuteranopia</SelectItem>
                      <SelectItem value="tritanopia">Tritanopia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="reduced-motion">Reduce Motion</Label>
                  <Switch
                    id="reduced-motion"
                    checked={settings.reducedMotion}
                    onCheckedChange={(checked) => updateSetting("reducedMotion", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Audio Settings */}
            <Card className={settings.highContrast ? "bg-gray-900 border-gray-700" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Volume2 className="h-5 w-5" />
                  <span>Audio Settings</span>
                </CardTitle>
                <CardDescription className={settings.highContrast ? "text-gray-400" : ""}>
                  Configure text-to-speech and audio features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="tts">Text-to-Speech</Label>
                  <Switch
                    id="tts"
                    checked={settings.textToSpeech}
                    onCheckedChange={(checked) => updateSetting("textToSpeech", checked)}
                  />
                </div>

                <div>
                  <Label>Voice Speed: {settings.voiceSpeed[0]}x</Label>
                  <Slider
                    value={settings.voiceSpeed}
                    onValueChange={(value) => updateSetting("voiceSpeed", value)}
                    max={2}
                    min={0.5}
                    step={0.1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Language</Label>
                  <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Settings */}
            <Card className={settings.highContrast ? "bg-gray-900 border-gray-700" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Keyboard className="h-5 w-5" />
                  <span>Navigation</span>
                </CardTitle>
                <CardDescription className={settings.highContrast ? "text-gray-400" : ""}>
                  Keyboard and navigation preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="keyboard-nav">Enhanced Keyboard Navigation</Label>
                  <Switch
                    id="keyboard-nav"
                    checked={settings.keyboardNav}
                    onCheckedChange={(checked) => updateSetting("keyboardNav", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="screen-reader">Screen Reader Optimization</Label>
                  <Switch
                    id="screen-reader"
                    checked={settings.screenReader}
                    onCheckedChange={(checked) => updateSetting("screenReader", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview and Demo */}
          <div className="lg:col-span-2 space-y-6">
            {/* Text-to-Speech Demo */}
            <Card className={settings.highContrast ? "bg-gray-900 border-gray-700" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Volume2 className="h-5 w-5" />
                  <span>Text-to-Speech Demo</span>
                </CardTitle>
                <CardDescription className={settings.highContrast ? "text-gray-400" : ""}>
                  Try out the text-to-speech functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`p-4 rounded-lg mb-4 ${
                    settings.highContrast ? "bg-gray-800" : "bg-gray-50"
                  } ${settings.dyslexiaFont ? "font-mono" : ""}`}
                  style={{ fontSize: `${settings.fontSize[0]}px` }}
                >
                  <p>{currentText}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    onClick={togglePlayback}
                    disabled={!settings.textToSpeech}
                    variant={settings.highContrast ? "outline" : "default"}
                  >
                    {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  <Button variant="outline" disabled={!settings.textToSpeech}>
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" disabled={!settings.textToSpeech}>
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                {!settings.textToSpeech && (
                  <p className={`text-sm mt-2 ${settings.highContrast ? "text-gray-400" : "text-gray-500"}`}>
                    Enable Text-to-Speech in the settings to use this feature
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Sample Content */}
            <Card className={settings.highContrast ? "bg-gray-900 border-gray-700" : ""}>
              <CardHeader>
                <CardTitle
                  className={`${settings.dyslexiaFont ? "font-mono" : ""}`}
                  style={{ fontSize: `${settings.fontSize[0] * 1.2}px` }}
                >
                  Sample Learning Content
                </CardTitle>
                <CardDescription className={settings.highContrast ? "text-gray-400" : ""}>
                  See how your accessibility settings affect content display
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`space-y-4 ${settings.dyslexiaFont ? "font-mono" : ""}`}
                  style={{ fontSize: `${settings.fontSize[0]}px` }}
                >
                  <h3 className="text-xl font-semibold">The Water Cycle</h3>

                  <p>
                    The water cycle is a continuous process that moves water throughout Earth's atmosphere, land, and
                    oceans. This natural cycle is powered by energy from the sun and includes several key stages.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div
                      className={`p-4 rounded-lg ${
                        settings.highContrast
                          ? "bg-gray-800 border border-gray-600"
                          : "bg-blue-50 border border-blue-200"
                      }`}
                    >
                      <h4 className="font-semibold mb-2">Evaporation</h4>
                      <p className="text-sm">
                        Heat from the sun causes water in oceans, lakes, and rivers to change from liquid to vapor.
                      </p>
                    </div>

                    <div
                      className={`p-4 rounded-lg ${
                        settings.highContrast
                          ? "bg-gray-800 border border-gray-600"
                          : "bg-green-50 border border-green-200"
                      }`}
                    >
                      <h4 className="font-semibold mb-2">Condensation</h4>
                      <p className="text-sm">Water vapor rises and cools, forming tiny droplets that create clouds.</p>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg mt-4 ${settings.highContrast ? "bg-gray-800" : "bg-yellow-50"}`}>
                    <h4 className="font-semibold mb-2">💡 Quick Tip</h4>
                    <p className="text-sm">
                      Remember the water cycle with this acronym: <strong>EPIC</strong> - Evaporation, Precipitation,
                      Infiltration, Collection
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Keyboard Shortcuts */}
            <Card className={settings.highContrast ? "bg-gray-900 border-gray-700" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Keyboard className="h-5 w-5" />
                  <span>Keyboard Shortcuts</span>
                </CardTitle>
                <CardDescription className={settings.highContrast ? "text-gray-400" : ""}>
                  Navigate efficiently using keyboard shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Toggle Text-to-Speech</span>
                      <Badge variant="outline">Ctrl + T</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Increase Font Size</span>
                      <Badge variant="outline">Ctrl + +</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Decrease Font Size</span>
                      <Badge variant="outline">Ctrl + -</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>High Contrast Toggle</span>
                      <Badge variant="outline">Ctrl + H</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Skip to Main Content</span>
                      <Badge variant="outline">Alt + M</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Focus Search</span>
                      <Badge variant="outline">Ctrl + K</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
