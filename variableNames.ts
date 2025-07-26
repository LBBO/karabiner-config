export const VariableNames = {
  Vim: {
    NormalMode: 'vim_mode',
    VisualMode: 'vim_visual_mode',
    // Not a proper Vim mode, but used to track whether we're trying to delete something
    DeleteMode: 'vim_delete_mode',
    GPressed: 'g_pressed',
  },
} as const
