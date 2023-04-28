export enum TriggerEvent {
  onClick = "onClick",
  onContextMenu = "onContextMenu",
  onDoubleClick = "onDoubleClick",
  onMouseEnter = "onMouseEnter",
  onMouseOver = "onMouseOver",
}

export type EditMenuComponentProps = {
  initialText: string;
  save: (updatedText: string) => void;
  closeMenu: () => void;
};

export type TextObject = Record<string, string | Record<string, any>>;

export type RevertFn = () => void;

export type TextUpdateProviderProps = {
  children: React.ReactNode;
  text?: TextObject;
  triggerEvent?: TriggerEvent;
  save: (textObject: TextObject, RevertFn) => void;
  active: boolean;
  editMenuComponent?:
    | React.ReactElement<EditMenuComponentProps>
    | ((props: EditMenuComponentProps) => React.ReactElement);
};
