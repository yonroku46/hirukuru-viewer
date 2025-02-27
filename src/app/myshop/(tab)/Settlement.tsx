import React, { Suspense, useEffect } from 'react';
import Loading from '@/app/loading';
import ViewTitle from '@/components/layout/ViewTitle';
import { currency } from '@/common/utils/StringUtils';
// import PartnerService from '@/api/service/PartnerService';

function Settlement()  {

  // const partnerService = PartnerService();

  useEffect(() => {
  }, []);

  return (
    <Suspense fallback={<Loading circular />}>
      <div className="tab-contents settlement">
        <div className="tab-title">
          <ViewTitle
            title={`清算管理フォーム`}
            description="清算管理"
          />
        </div>
        <div className="settlement-info-wrapper">
          <div className="settlement-info-item">
            <label>清算日</label>
            <p>毎週木曜日</p>
          </div>
          <div className="settlement-info-item">
            <label>受け取り口座</label>
            <p>{`福岡銀行 普通\n123-4567-890`}</p>
          </div>
          <div className="settlement-info-item">
            <label>次回の精算予定金額</label>
            <p>{currency(0, "円")}</p>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default React.memo(Settlement);
