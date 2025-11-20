import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check } from "lucide-react";
import type { LinkedinProfile } from "@shared/schema";

interface LinkedInTemplateDisplayProps {
  profile: LinkedinProfile;
  pathType: "college" | "professional" | "starter";
}

export function LinkedInTemplateDisplay({ profile, pathType }: LinkedInTemplateDisplayProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getPathColor = () => {
    switch (pathType) {
      case "college":
        return "border-blue-500 bg-blue-50";
      case "professional":
        return "border-green-500 bg-green-50";
      case "starter":
        return "border-orange-500 bg-orange-50";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="headline" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="headline">Headline</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        {/* Headline Tab */}
        <TabsContent value="headline" className="space-y-4">
          <Card className={`border-2 p-6 ${getPathColor()}`}>
            <h3 className="text-lg font-semibold mb-4">LinkedIn Headline Template</h3>
            <p className="text-sm text-gray-600 mb-4">
              Copy this headline to your LinkedIn profile. It's optimized for recruiter searches.
            </p>

            <div className="bg-white border rounded-lg p-4 mb-4 min-h-[80px] flex items-center">
              <p className="text-base">{profile.headline}</p>
            </div>

            <Button
              onClick={() => copyToClipboard(profile.headline || "", "headline")}
              className="w-full"
              variant="outline"
            >
              {copiedSection === "headline" ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Headline
                </>
              )}
            </Button>
          </Card>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-4">
          <Card className={`border-2 p-6 ${getPathColor()}`}>
            <h3 className="text-lg font-semibold mb-4">LinkedIn About Section Template</h3>
            <p className="text-sm text-gray-600 mb-4">
              Copy this content to your LinkedIn "About" section. Feel free to personalize it further.
            </p>

            <div className="bg-white border rounded-lg p-4 mb-4 min-h-[200px] whitespace-pre-wrap">
              <p className="text-sm">{profile.about}</p>
            </div>

            <Button
              onClick={() => copyToClipboard(profile.about || "", "about")}
              className="w-full"
              variant="outline"
            >
              {copiedSection === "about" ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy About Section
                </>
              )}
            </Button>
          </Card>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience" className="space-y-4">
          <Card className={`border-2 p-6 ${getPathColor()}`}>
            <h3 className="text-lg font-semibold mb-4">LinkedIn Experience Section Template</h3>
            <p className="text-sm text-gray-600 mb-4">
              Use these templates for your experience section on LinkedIn. Copy each section separately.
            </p>

            <div className="space-y-4">
              {profile.experienceSection &&
                Array.isArray(profile.experienceSection) &&
                profile.experienceSection.map((exp, index) => (
                  <div key={index} className="bg-white border rounded-lg p-4">
                    <p className="font-semibold mb-2">{exp.title}</p>
                    <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">
                      {exp.description}
                    </p>
                    <Button
                      onClick={() =>
                        copyToClipboard(
                          `${exp.title}\n\n${exp.description}`,
                          `experience-${index}`
                        )
                      }
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      {copiedSection === `experience-${index}` ? (
                        <>
                          <Check className="mr-2 h-3 w-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-3 w-3" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                ))}
            </div>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-4">
          <Card className={`border-2 p-6 ${getPathColor()}`}>
            <h3 className="text-lg font-semibold mb-4">LinkedIn Skills Template</h3>
            <p className="text-sm text-gray-600 mb-4">
              These are the skills we recommend adding to your LinkedIn profile. Add them in order of
              relevance.
            </p>

            <div className="bg-white border rounded-lg p-4 mb-4">
              <div className="space-y-2">
                {profile.skillsList &&
                  Array.isArray(profile.skillsList) &&
                  profile.skillsList.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50">
                      <span className="text-sm">{skill}</span>
                      <span className="text-xs text-gray-500">#{index + 1}</span>
                    </div>
                  ))}
              </div>
            </div>

            <Button
              onClick={() =>
                copyToClipboard(
                  profile.skillsList && Array.isArray(profile.skillsList)
                    ? profile.skillsList.join("\n")
                    : "",
                  "skills"
                )
              }
              className="w-full"
              variant="outline"
            >
              {copiedSection === "skills" ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy All Skills
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 mt-4">
              💡 Tip: Add skills to your LinkedIn profile in the same order shown above for better
              visibility to recruiters.
            </p>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tips Section */}
      <Card className="bg-blue-50 border-blue-200 p-4">
        <h4 className="font-semibold text-blue-900 mb-3">LinkedIn Profile Tips</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex gap-2">
            <span>✓</span>
            <span>Use a professional photo as your profile picture</span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>Add a custom LinkedIn URL (linkedin.com/in/yourname)</span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>Keep your headline concise (max 120 characters)</span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>Add keywords related to your target roles</span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>Use the featured section to showcase your best work</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
