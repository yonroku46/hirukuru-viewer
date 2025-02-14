import React, { Suspense, useEffect } from 'react';
import Loading from '@/app/loading';
import Title from '@/components/layout/Title';

interface SettingProps {
  shop: Shop;
}

function Dashboard({ shop }: SettingProps)  {

  useEffect(() => {
    console.log(shop);
  }, [shop]);

  return (
    <Suspense fallback={<Loading circular />}>
      <div className="tab-title">
        <Title
          title="ダッシュボード"
        />
      </div>
      <div className="tab-contents dashboard">
      </div>
    </Suspense>
  );
};

export default React.memo(Dashboard);
