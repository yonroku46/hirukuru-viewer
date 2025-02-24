import React, { Suspense, useEffect } from 'react';
import Loading from '@/app/loading';
import ViewTitle from '@/components/layout/ViewTitle';

import TroubleshootIcon from '@mui/icons-material/Troubleshoot';

interface SettingProps {
  shop: Shop;
}

function Dashboard({ shop }: SettingProps)  {

  useEffect(() => {
    console.log(shop);
  }, [shop]);

  return (
    <Suspense fallback={<Loading circular />}>
      <div className="tab-contents dashboard">
        <div className="tab-title">
          <ViewTitle
            title={`${shop.shopName}様、こんにちは🙂`}
            description="ダッシュボード"
          />
        </div>
        <div className="dashboard-content-wrapper">
          <TroubleshootIcon className="content-icon" />
          <p className="dashboard-content-text">
            {`ダッシュボード表示をするためのデータが\nまだ十分に集まっていません`}
          </p>
        </div>
      </div>
    </Suspense>
  );
};

export default React.memo(Dashboard);
