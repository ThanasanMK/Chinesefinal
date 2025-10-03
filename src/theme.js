// โทนจีน ๆ
export const COLORS = {
  primary: '#C91F37',   // แดงจีน
    gold: '#D4AF37',
    jade: '#0F766E',
    bg: '#FFF9F1',
    surface: '#FFF4E3',
    text: '#1F2937',
    muted: '#6B7280',
    danger: '#B91C1C',
};

export const paperTheme = {
    dark: false,
    roundness: 12,
    colors: {
    primary: COLORS.primary,
    secondary: COLORS.jade,
    background: COLORS.bg,
    surface: COLORS.surface,
    text: COLORS.text,
    outline: '#E5E7EB',
    onPrimary: '#FFFFFF',
    error: COLORS.danger,
    },
  // ปรับดีไซน์ component หลัก ๆ
    components: {
    Button: { contentStyle: { paddingVertical: 10 } },
    TextInput: { outlineColor: '#F1E3D3' },
    Card: { style: { borderRadius: 16, overflow: 'hidden' } },
    },
};
