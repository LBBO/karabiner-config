export const VariableNames = {
  Vim: {
    NormalMode: 'vim_mode',
    VisualMode: 'vim_visual_mode',
    // Not proper Vim modes, but used to track whether we're trying to delete something
    YankMode: 'vim_yank_mode',
    ChangeMode: 'vim_change_mode',
    DeleteMode: 'vim_delete_mode',
    GPressed: 'g_pressed',
  },
} as const
