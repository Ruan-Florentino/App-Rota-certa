import React from 'react';
import { typography } from '@/styles/typography';

type TypographyScale = typeof typography;
type VariantCategory = keyof TypographyScale;

// Create a union type of all possible exact variants
// e.g. "display-2xl" | "heading-h1" | "body-lg" etc.
// The prompt asked for flat variants: 'display-2xl' | 'h1' | 'body-lg' | 'mono-md'
export type TextVariant =
  | 'display-2xl' | 'display-xl' | 'display-lg' | 'display-md' | 'display-sm'
  | 'h1' | 'h2' | 'h3' | 'h4'
  | 'body-lg' | 'body-md' | 'body-sm' | 'body-xs'
  | 'label-lg' | 'label-md' | 'label-sm'
  | 'mono-lg' | 'mono-md' | 'mono-sm'
  | 'accent-lg' | 'accent-md' | 'accent-sm';

interface TextProps {
  variant: TextVariant;
  as?: React.ElementType;
  weight?: 300 | 400 | 500 | 600 | 700 | 800 | 900;
  tracking?: 'tight' | 'normal' | 'wide';
  color?: string;
  balance?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Text = ({
  variant,
  as,
  weight,
  tracking,
  color,
  balance,
  className = '',
  children,
  ...props
}: TextProps & React.HTMLAttributes<HTMLElement>) => {
  const getStyleObject = (v: TextVariant): React.CSSProperties => {
    let cat: string, key: string;
    if (v.startsWith('display-')) { cat = 'display'; key = v.replace('display-', ''); }
    else if (v.startsWith('h')) { cat = 'heading'; key = v; }
    else if (v.startsWith('body-')) { cat = 'body'; key = v.replace('body-', ''); }
    else if (v.startsWith('label-')) { cat = 'label'; key = v.replace('label-', ''); }
    else if (v.startsWith('mono-')) { cat = 'mono'; key = v.replace('mono-', ''); }
    else if (v.startsWith('accent-')) { cat = 'accent'; key = v.replace('accent-', ''); }
    else { cat = 'body'; key = 'md'; }

    const rawStyle = (typography as any)[cat][key];
    
    const inlineStyle: React.CSSProperties = { ...rawStyle };
    if (weight) inlineStyle.fontWeight = weight;
    if (balance) inlineStyle.textWrap = 'balance';
    if (tracking === 'tight') inlineStyle.letterSpacing = '-0.04em';
    if (tracking === 'wide') inlineStyle.letterSpacing = '0.05em';
    
    return inlineStyle;
  };

  const getFontFamilyClass = (v: TextVariant): string => {
    if (v.startsWith('display-') || v.startsWith('h')) return 'font-display';
    if (v.startsWith('body-') || v.startsWith('label-')) return 'font-sans';
    if (v.startsWith('mono-')) return 'font-mono';
    if (v.startsWith('accent-')) return 'font-accent';
    return 'font-sans';
  };

  const Component: any = as || (variant.startsWith('display-') || variant.startsWith('h') ? 'h2' : 'span');
  const baseStyle = getStyleObject(variant);
  const colorClass = color ? `text-${color}` : '';

  return (
    <Component
      style={baseStyle}
      className={`${getFontFamilyClass(variant)} ${colorClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
