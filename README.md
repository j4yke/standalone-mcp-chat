# Standalone MCP Chat Window Animation

Experimental, pixel-perfect animated chat terminal for Next.js. This component uses `framer-motion` for complex `layoutId` morphing, fluid reflow transitions, and a custom typewriter engine to simulate AI Agent interactions.

## 🚀 Getting Started

This repository is a fully functional Next.js project. To run it locally:

1. **Clone and Install:**
   ```bash
   git clone https://github.com/j4yke/standalone-mcp-chat.git
   cd standalone-mcp-chat
   npm install
   ```

2. **Run the Dev Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the animation.

## 🛠 Integration Guide

If you want to move the `MCPChatWindow` into your own existing project:

1. **Prerequisites:**
   Ensure you have the required dependencies:
   ```bash
   npm install framer-motion lucide-react
   ```

2. **Copy Files:**
   - Copy `src/components/MCPChatWindow.tsx` to your components folder.
   - Copy the SVGs from `public/` into your project's `public/` folder (`robotic-stroke-rounded.svg` and `wrench-01-stroke-rounded.svg`).

3. **Usage:**
   ```tsx
   import MCPChatWindow from "@/components/MCPChatWindow";

   export default function Page() {
     return <MCPChatWindow />;
   }
   ```

## 🎨 Customization (For Developers)

The component is designed to be extensible while preserving the core animation physics.

### Custom Play/Replay Buttons
You can replace the default "See it in action" overlay button with your production design system components using the `renderPlayButton` prop.

```tsx
<MCPChatWindow 
  renderPlayButton={({ onClick, isCompleted }) => (
    <button 
      onClick={onClick}
      className="bg-blue-600 px-4 py-2 rounded-lg text-white font-bold hover:bg-blue-700 transition"
    >
      {isCompleted ? "Run Again" : "Watch Demo"}
    </button>
  )} 
/>
```

### Key Features
- **Shared Layout Transitions**: The input field morphs seamlessly into chat bubbles using Framer Motion's `layoutId`.
- **Responsive Geometry**: Native vertical reflowing for mobile (320px+) without using CSS `scale` hacks.
- **Typewriter Engine**: State-driven typing sequences with randomized speed variance for a realistic feel.
- **Tool UI**: Built-in support for displaying tool invocation badges (e.g., `create_template`).

## 📁 Project Structure

- `src/components/MCPChatWindow.tsx`: The heart of the animation logic.
- `public/`: Assets required for terminal iconography.
- `src/app/page.tsx`: Demo implementation.
