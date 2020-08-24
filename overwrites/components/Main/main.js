import React from "react";
import { bool, shape, string } from "prop-types";
import { useScrollLock } from "@magento/peregrine";

import { mergeClasses } from "@magento/venia-ui/lib/classify";
import Header from "@magento/venia-ui/lib/components/Header";
import Footer from "@magento/venia-ui/lib/components/Footer";
import defaultClasses from "@magento/venia-ui/lib/components/Main/main.css";
// rewardpoint customize
import InjectedComponents from '@simicart/simi-module/inject/injectedComponent';
import {
  REWARDPOINT_MODULE,
  checkPlugin,
} from "@simicart/simi-module/util/checkedPlugin";
// rewardpoint customize

const Main = (props) => {
  const { children, isMasked } = props;
  const classes = mergeClasses(defaultClasses, props.classes);

  const rootClass = isMasked ? classes.root_masked : classes.root;
  const pageClass = isMasked ? classes.page_masked : classes.page;

  useScrollLock(isMasked);

  const existModuleRewardPoint = checkPlugin(REWARDPOINT_MODULE);

  return existModuleRewardPoint && existModuleRewardPoint.CustomMain ? (
    <InjectedComponents
      module={REWARDPOINT_MODULE}
      func={"CustomMain"}
      parentProps={{ rootClass, pageClass, children }}
    />
  ) : (
    <main className={rootClass}>
      <Header />
      <div className={pageClass}>{children}</div>
      <Footer />
    </main>
  );
};

export default Main;

Main.propTypes = {
  classes: shape({
    page: string,
    page_masked: string,
    root: string,
    root_masked: string,
  }),
  isMasked: bool,
};
