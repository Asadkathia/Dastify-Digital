'use client';

import type { WidgetInstance } from '@/payload/views/PageEditor/types';
import { HeadingWidget } from './HeadingWidget';
import { ParagraphWidget } from './ParagraphWidget';
import { ButtonWidget } from './ButtonWidget';
import { ImageWidget } from './ImageWidget';
import { SpacerWidget } from './SpacerWidget';
import { DividerWidget } from './DividerWidget';
import { BadgeWidget } from './BadgeWidget';
import { ListWidget } from './ListWidget';
import { IconWidget } from './IconWidget';
import { VideoWidget } from './VideoWidget';
import { ColumnsWidget } from './ColumnsWidget';

type WidgetRendererProps = {
  widget: WidgetInstance;
  /** When true, renders drag handles and click-to-select overlay (editor mode) */
  editorMode?: boolean;
  blockId?: string;
  onWidgetClick?: (widgetId: string) => void;
  selectedWidgetId?: string | null;
};

const WIDGET_MAP: Record<string, React.ComponentType<{ widget: WidgetInstance }>> = {
  heading:   HeadingWidget,
  paragraph: ParagraphWidget,
  button:    ButtonWidget,
  image:     ImageWidget,
  spacer:    SpacerWidget,
  divider:   DividerWidget,
  badge:     BadgeWidget,
  list:      ListWidget,
  icon:      IconWidget,
  video:     VideoWidget,
  columns:   ColumnsWidget,
};

export function WidgetRenderer({
  widget,
  editorMode,
  blockId,
  onWidgetClick,
  selectedWidgetId,
}: WidgetRendererProps) {
  const Component = WIDGET_MAP[widget.widgetType];

  if (!Component) {
    return (
      <div style={{ padding: '8px', background: '#fee', color: '#c00', fontSize: '12px', borderRadius: '4px' }}>
        Unknown widget: {widget.widgetType}
      </div>
    );
  }

  // Hidden widgets are invisible in preview, shown faded in editor
  if (widget.isHidden && !editorMode) return null;

  const isSelected = selectedWidgetId === widget.id;

  if (!editorMode) {
    return <Component widget={widget} />;
  }

  return (
    <div
      data-widget-id={widget.id}
      data-widget-type={widget.widgetType}
      data-block-id={blockId}
      style={{
        position: 'relative',
        outline: isSelected ? '2px solid #3b82f6' : '1px dashed transparent',
        outlineOffset: '1px',
        cursor: 'pointer',
        borderRadius: '2px',
        opacity: widget.isHidden ? 0.35 : 1,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onWidgetClick?.(widget.id);
      }}
    >
      {/* Drag handle */}
      <div
        className="widget-drag-handle"
        data-widget-drag-handle="true"
        style={{
          position: 'absolute',
          top: 0,
          left: -20,
          width: 16,
          height: 16,
          background: '#3b82f6',
          borderRadius: '2px',
          cursor: 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transition: 'opacity 0.15s',
          zIndex: 10,
          fontSize: '8px',
          color: '#fff',
        }}
      >
        ⠿
      </div>
      <Component widget={widget} />
    </div>
  );
}

type WidgetListRendererProps = {
  widgets: WidgetInstance[];
  editorMode?: boolean;
  blockId?: string;
  onWidgetClick?: (widgetId: string) => void;
  selectedWidgetId?: string | null;
};

export function WidgetListRenderer({ widgets, editorMode, blockId, onWidgetClick, selectedWidgetId }: WidgetListRendererProps) {
  if (!widgets || widgets.length === 0) {
    if (!editorMode) return null;
    return (
      <div
        style={{
          minHeight: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          fontSize: '13px',
          border: '1px dashed #cbd5e1',
          borderRadius: '4px',
          padding: '16px',
        }}
      >
        Drop widgets here
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {widgets.map((widget) => (
        <WidgetRenderer
          key={widget.id}
          widget={widget}
          editorMode={editorMode}
          blockId={blockId}
          onWidgetClick={onWidgetClick}
          selectedWidgetId={selectedWidgetId}
        />
      ))}
    </div>
  );
}
