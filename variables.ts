import { Condition, To } from './types'

export const VariableNames = {
  HyperKey: 'hyper_key',
  Vim: {
    NormalMode: 'vim_mode',
    VisualMode: 'vim_visual_mode',
    // Not proper Vim modes, but used to track whether we're trying to delete something
    YankMode: 'vim_yank_mode',
    ChangeMode: 'vim_change_mode',
    DeleteMode: 'vim_delete_mode',
    GPressed: 'g_pressed',
    // Additive selection modes
    InnerSelection: 'vim_inner_selection',
    OuterSelection: 'vim_outer_selection',
  },
} as const

type TransitiveStringProperties<T extends object> = {
  [K in keyof T]: T[K] extends object ? TransitiveStringProperties<T[K]> : T[K]
}[keyof T]

export type VariableName = TransitiveStringProperties<
  typeof VariableNames
> & // This is basically just for pretty-printing
{}

export const deactivate = (name: VariableName): To => ({
  set_variable: {
    name,
    value: 0,
  },
})

export const activate = (name: VariableName): To => ({
  set_variable: {
    name,
    value: 1,
  },
})

export const isActive = (name: VariableName): Condition => ({
  type: 'variable_if',
  name,
  value: 1,
})

export const isNotActive = (name: VariableName): Condition => ({
  type: 'variable_unless',
  name,
  value: 1,
})
