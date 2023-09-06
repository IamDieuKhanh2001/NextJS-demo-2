import ClientHeader from '@/components/ClientHeader/ClientHeader';
import AccountSideBar from '@/components/account/AccountSideBar';
import ClientLayout from '@/layouts/ClientLayout/ClientLayout'
import React, { ReactNode } from 'react'

interface AccountManagementLayoutProps {
    children: ReactNode;
  }
  
  const AccountManagementLayout: React.FC<AccountManagementLayoutProps> = ({ children }) => {
  
    return (
      <ClientLayout>
        <ClientHeader />
            <section style={{ backgroundColor: '#eee' }}>
                <div className="container py-5">
                    <div className="row">
                        <div className="col-lg-3">
                            <AccountSideBar />
                        </div>
                        <div className="col-lg-9">
                            {children}
                        </div>
                    </div>
                </div>
            </section>
      </ClientLayout>
    );
  };

export default AccountManagementLayout
