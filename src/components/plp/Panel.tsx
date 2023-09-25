import { useState, ReactNode } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function Panel({
  children,
  header,
  footer,
  showTitle = true
}: {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  showTitle?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="ais-Panel">
      {showTitle && header && (
        <div className="ais-Panel-header">
          {header}{' '}
          {collapsed ? (
            <AddIcon onClick={() => setCollapsed(false)} />
          ) : (
            <RemoveIcon onClick={() => setCollapsed(true)} />
          )}
        </div>
      )}
      <div className={collapsed ? 'ais-Panel-body--collapsed' : 'ais-Panel-body'}>{children}</div>
      {footer && <div className="ais-Panel-footer">{footer}</div>}
    </div>
  );
}
