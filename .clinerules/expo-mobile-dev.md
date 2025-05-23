## Brief overview
Guidelines for developing mobile applications using Expo and React Native with modern development practices including TypeScript, Tailwind CSS, and custom UI components.

## Development stack
- Expo as the primary mobile development framework
- TypeScript for enhanced type safety and development experience
- Tailwind CSS through NativeWind for consistent styling
- Custom UI components organized in a dedicated components directory
- Lucide React Native icons with NativeWind className support through iconWithClassName utility

## Project structure
- Separate UI components into dedicated component files
- Keep reusable utility functions in lib/ directory
- Organize icons into a dedicated lib/icons directory
- Use TypeScript for all new files
- Follow file naming convention: PascalCase for components, camelCase for utilities

## Coding style
- Use functional components with hooks
- Implement dark/light theme support in components
- Separate business logic from UI components
- Keep UI components modular and reusable
- Utilize TypeScript interfaces for props
- Apply iconWithClassName utility to all Lucide icons for proper styling support
- Use className prop on icons for color and opacity styling

## Mobile specific guidelines
- Support both dark and light themes for better user experience
- Consider Android-specific navigation bar handling
- Implement adaptive icons and proper splash screens
- Use custom Text components to maintain consistent typography

## Asset organization
- Keep images in assets/images directory
- Use descriptive names for image assets
- Include proper icon sizes for different platforms
