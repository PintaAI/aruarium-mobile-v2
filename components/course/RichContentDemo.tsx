import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { RichContentRenderer } from './RichContentRenderer';

// Enhanced sample data with comprehensive formatting examples
const COMPREHENSIVE_SAMPLE_DATA = {
  id: 999,
  title: "Testong doang ini balik aja",
  description: "Demonstrating all supported rich content features including headings, colors, lists, and formatting.",
  jsonDescription: `{
    "type": "doc",
    "content": [
      {
        "type": "heading",
        "attrs": {"level": 1},
        "content": [
          {
            "type": "text",
            "marks": [
              {"type": "textStyle", "attrs": {"color": "#DC2626"}},
              {"type": "bold"}
            ],
            "text": "🎯 Main Title (H1) - Red Bold"
          }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          {"type": "text", "text": "This is a comprehensive demo showing all supported rich content features. Let's explore each formatting option! ✨"}
        ]
      },
      {
        "type": "heading",
        "attrs": {"level": 2},
        "content": [
          {
            "type": "text",
            "marks": [
              {"type": "textStyle", "attrs": {"color": "#059669"}},
              {"type": "bold"}
            ],
            "text": "📝 Section Title (H2) - Green Bold"
          }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          {"type": "text", "text": "Here we demonstrate different "},
          {
            "type": "text",
            "marks": [{"type": "textStyle", "attrs": {"color": "#2563EB"}}],
            "text": "colored text elements"
          },
          {"type": "text", "text": " and "},
          {
            "type": "text",
            "marks": [{"type": "bold"}],
            "text": "bold formatting"
          },
          {"type": "text", "text": " within paragraphs."}
        ]
      },
      {
        "type": "heading",
        "attrs": {"level": 3},
        "content": [
          {
            "type": "text",
            "marks": [
              {"type": "textStyle", "attrs": {"color": "#7C3AED"}},
              {"type": "bold"}
            ],
            "text": "🎨 Subsection (H3) - Purple Bold"
          }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          {"type": "text", "text": "Now let's look at different list types and color combinations."}
        ]
      },
      {
        "type": "heading",
        "attrs": {"level": 3},
        "content": [
          {
            "type": "text",
            "marks": [
              {"type": "textStyle", "attrs": {"color": "#EA580C"}},
              {"type": "bold"}
            ],
            "text": "📋 Bullet List Examples"
          }
        ]
      },
      {
        "type": "bulletList",
        "attrs": {"tight": false},
        "content": [
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  {
                    "type": "text",
                    "marks": [{"type": "textStyle", "attrs": {"color": "#DC2626"}}, {"type": "bold"}],
                    "text": "Red Bold Item 🔴"
                  }
                ]
              },
              {
                "type": "paragraph",
                "content": [
                  {"type": "text", "text": "This item demonstrates red colored text with bold formatting for emphasis."}
                ]
              }
            ]
          },
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  {
                    "type": "text",
                    "marks": [{"type": "textStyle", "attrs": {"color": "#059669"}}, {"type": "bold"}],
                    "text": "Green Bold Item 🟢"
                  }
                ]
              },
              {
                "type": "paragraph",
                "content": [
                  {"type": "text", "text": "Environmental benefits and sustainable practices are highlighted in green."}
                ]
              }
            ]
          },
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  {
                    "type": "text",
                    "marks": [{"type": "textStyle", "attrs": {"color": "#2563EB"}}, {"type": "bold"}],
                    "text": "Blue Bold Item 🔵"
                  }
                ]
              },
              {
                "type": "paragraph",
                "content": [
                  {"type": "text", "text": "Information and educational content typically uses blue coloring."}
                ]
              }
            ]
          }
        ]
      },
      {
        "type": "heading",
        "attrs": {"level": 3},
        "content": [
          {
            "type": "text",
            "marks": [
              {"type": "textStyle", "attrs": {"color": "#BE185D"}},
              {"type": "bold"}
            ],
            "text": "🔢 Text Color Variations"
          }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          {"type": "text", "text": "Here are examples of different text colors: "},
          {
            "type": "text",
            "marks": [{"type": "textStyle", "attrs": {"color": "#EF4444"}}],
            "text": "Red text"
          },
          {"type": "text", "text": ", "},
          {
            "type": "text",
            "marks": [{"type": "textStyle", "attrs": {"color": "#10B981"}}],
            "text": "green text"
          },
          {"type": "text", "text": ", "},
          {
            "type": "text",
            "marks": [{"type": "textStyle", "attrs": {"color": "#3B82F6"}}],
            "text": "blue text"
          },
          {"type": "text", "text": ", "},
          {
            "type": "text",
            "marks": [{"type": "textStyle", "attrs": {"color": "#8B5CF6"}}],
            "text": "purple text"
          },
          {"type": "text", "text": ", and "},
          {
            "type": "text",
            "marks": [{"type": "textStyle", "attrs": {"color": "#F59E0B"}}],
            "text": "yellow text"
          },
          {"type": "text", "text": "."}
        ]
      },
      {
        "type": "heading",
        "attrs": {"level": 2},
        "content": [
          {
            "type": "text",
            "marks": [
              {"type": "textStyle", "attrs": {"color": "#0891B2"}},
              {"type": "bold"}
            ],
            "text": "🎯 Advanced Formatting Examples"
          }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          {"type": "text", "text": "This section shows complex formatting with "},
          {
            "type": "text",
            "marks": [{"type": "bold"}, {"type": "textStyle", "attrs": {"color": "#DC2626"}}],
            "text": "bold red text"
          },
          {"type": "text", "text": " and "},
          {
            "type": "text",
            "marks": [{"type": "textStyle", "attrs": {"color": "#059669"}}],
            "text": "regular green text"
          },
          {"type": "text", "text": " in the same paragraph."}
        ]
      },
      {
        "type": "heading",
        "attrs": {"level": 3},
        "content": [
          {
            "type": "text",
            "marks": [
              {"type": "textStyle", "attrs": {"color": "#7C3AED"}},
              {"type": "bold"}
            ],
            "text": "📊 Mixed Content Example"
          }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          {"type": "text", "text": "Combining "},
          {
            "type": "text",
            "marks": [{"type": "bold"}],
            "text": "bold"
          },
          {"type": "text", "text": ", "},
          {
            "type": "text",
            "marks": [{"type": "textStyle", "attrs": {"color": "#DC2626"}}],
            "text": "colored"
          },
          {"type": "text", "text": ", and "},
          {
            "type": "text",
            "marks": [{"type": "textStyle", "attrs": {"color": "#059669"}}, {"type": "bold"}],
            "text": "bold colored"
          },
          {"type": "text", "text": " text for maximum impact! 🚀"}
        ]
      }
    ]
  }`
};

// Predefined color palette
const COLOR_PALETTE = {
  primary: '#2563EB',      // Blue
  secondary: '#059669',    // Green  
  accent: '#DC2626',       // Red
  warning: '#F59E0B',      // Yellow
  purple: '#7C3AED',       // Purple
  pink: '#BE185D',         // Pink
  orange: '#EA580C',       // Orange
  cyan: '#0891B2',         // Cyan
};

export function RichContentDemo() {
  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="p-4" style={{ backgroundColor: COLOR_PALETTE.primary }}>
        <Text className="text-xl font-bold text-white mb-2">Test doang ini mah balik sana</Text>
        <Text className="text-white/80">JSON Native Component Rendering</Text>
      </View>

      {/* Course Info */}
      <View className="p-4 border-b border-gray-200">
        <Text className="text-lg font-semibold mb-2">{COMPREHENSIVE_SAMPLE_DATA.title}</Text>
        <Text className="text-gray-600 text-sm mb-1">Demo ID: {COMPREHENSIVE_SAMPLE_DATA.id}</Text>
        <Text className="text-gray-600 text-sm">
          Plain Description: {COMPREHENSIVE_SAMPLE_DATA.description}
        </Text>
      </View>

      {/* Color Palette Display */}
      <View className="p-4 border-b border-gray-200">
        <Text className="text-base font-semibold mb-3">Predefined Color Palette:</Text>
        <View className="flex-row flex-wrap gap-2">
          {Object.entries(COLOR_PALETTE).map(([name, color]) => (
            <View key={name} className="flex-row items-center">
              <View 
                className="w-4 h-4 rounded mr-2 border border-gray-300" 
                style={{ backgroundColor: color }}
              />
              <Text className="text-xs text-gray-600 mr-3">{name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Features List */}
      <View className="p-4 border-b border-gray-200">
        <Text className="text-base font-semibold mb-2">Features Demonstrated:</Text>
        <View className="gap-1">
          <Text className="text-sm">• H1, H2, H3 headings with colors</Text>
          <Text className="text-sm">• Colored text (8 predefined colors)</Text>
          <Text className="text-sm">• Bold formatting</Text>
          <Text className="text-sm">• Bullet lists with nested content</Text>
          <Text className="text-sm">• Mixed formatting combinations</Text>
          <Text className="text-sm">• Emoji support 🎨✨🚀</Text>
          <Text className="text-sm">• Native React Native components</Text>
        </View>
      </View>

      {/* Rendering Info */}
      <View className="p-4 border-b border-gray-200">
        <Text className="text-base font-semibold mb-2">Rendering Method:</Text>
        <View className="bg-blue-50 p-3 rounded-lg">
          <Text className="text-sm text-blue-800 font-medium">JSON (ProseMirror) → Native Components</Text>
          <Text className="text-xs text-blue-600 mt-1">
            Fast, native rendering using React Native Text and View components
          </Text>
        </View>
      </View>

      {/* Content Status */}
      <View className="p-4 border-b border-gray-200">
        <Text className="text-base font-semibold mb-2">Content Status:</Text>
        <View className="gap-1">
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full mr-2 bg-green-500" />
            <Text className="text-sm">Plain Description: Available</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full mr-2 bg-green-500" />
            <Text className="text-sm">JSON Description: Available (Enhanced)</Text>
          </View>
        </View>
      </View>

      {/* Rich Content Renderer */}
      <View className="flex-1">
        <View className="p-4 border-b border-gray-200">
          <Text className="text-base font-semibold">
            Rendered Content (JSON Native Mode):
          </Text>
        </View>
        
        <RichContentRenderer
          jsonDescription={COMPREHENSIVE_SAMPLE_DATA.jsonDescription}
          fallbackDescription={COMPREHENSIVE_SAMPLE_DATA.description}
          className="flex-1 min-h-96"
        />
      </View>
    </ScrollView>
  );
}

export default RichContentDemo;
