// data.js
 // 1. 接入您给定的标准连接桩定义对象（回归原始桩位，去掉扩展编号桩）
export const defaultPorts = {
  groups: {
    top: { position: 'top', attrs: { circle: { r: 0, magnet: true } } },
    bottom: { position: 'bottom', attrs: { circle: { r: 0, magnet: true } } },
    left: { position: 'left', attrs: { circle: { r: 0, magnet: true } } },
    right: { position: 'right', attrs: { circle: { r: 0, magnet: true } } }
  },
  items: [
    { id: 'top', group: 'top' },
    { id: 'bottom', group: 'bottom' },
    { id: 'left', group: 'left' },
    { id: 'right', group: 'right' }
  ]
};

  // 预设最多 5 种不同 source 对应的颜色列表
export const sourceColorPalette = [
  '#ff9900', // 索引 0: 专项债 (橙)
  '#a180ff', // 索引 1: 财政拨款 (紫)
  '#2db7f5', // 索引 2: 自筹资金 (蓝)
  '#19be6b', // 索引 3: 银行贷款 (绿)
  '#ed4014'  // 索引 4: 其他资金 (红)
];
export const response = [
    // ---- 第一层：资金来源 ----
    { "id": "zxj", "name": "专项债", "level": 1, "source": [], "parent": null, "inflowAmount": null },
    { "id": "czbk", "name": "财政拨款", "level": 1, "source": [], "parent": null, "inflowAmount": null },
    { "id": "zczy", "name": "自筹资金", "level": 1, "source": [], "parent": null, "inflowAmount": null }, // 动态扩容测试
    { "id": "ykdk", "name": "银行贷款", "level": 1, "source": [], "parent": null, "inflowAmount": null }, // 动态扩容测试

    // ---- 第二层：核心主体（source 细分来源金额，自身平级记录总额） ----
    { 
      "id": "st_subway", 
      "name": "上海申通地铁", 
      "level": 2, 
      "inflowAmount": "2800.00万元",
      // parents 已重命名为 source
      "source": [
        { "id": "zxj", "amount": "800.00万元" },
        { "id": "czbk", "amount": "2000.00万元" },
        { "id": "zczy", "amount": "2000.00万元" },
        { "id": "ykdk", "amount": "2000.00万元" }
      ],
      // parent 取自原数组中的第一个元素（即 zxj 的对象格式）
      "parent": ''
    },

    // ---- 第三层：项目线路 ----
    { "id": "line_cm", "name": "崇明线", "level": 3, "source": ["zxj", 'czbk'], "parent": "st_subway", "inflowAmount": "2700.00万元" },
    { "id": "line_21", "name": "21号线", "level": 3, "source": ["zxj", 'czbk'], "parent": "st_subway", "inflowAmount": "1000.00万元" },
    { "id": "line_22", "name": "22号线", "level": 3, "source": ["zxj", 'czbk'], "parent": "st_subway", "inflowAmount": "1000.00万元" },
    { "id": "line_23", "name": "23号线", "level": 3, "source": ["zxj", 'czbk'], "parent": "st_subway", "inflowAmount": "1000.00万元" },
    { "id": "line_24", "name": "24号线", "level": 3, "source": ["zxj", 'czbk'], "parent": "st_subway", "inflowAmount": "1000.00万元" },
     { "id": "line_25", "name": "25号线", "level": 3, "source": ["zxj", 'czbk'], "parent": "st_subway", "inflowAmount": "1000.00万元" },

    // ---- 第四层：建设单位 ----
    { "id": "bj_8", "name": "中建八局", "level": 4, "source": ["zxj", 'czbk'], "parent": "line_cm", "retainedAmount": "1000万元", "inflowAmount": "500.00万元" },
    { "id": "jc_group", "name": "基础工程集团", "level": 4, "source": ["zxj", 'czbk'], "parent": "line_cm", "inflowAmount": "1000.00万元" },
    { "id": "bj_81", "name": "中建八局", "level": 4, "source": ["zxj", 'czbk'], "parent": "line_24", "retainedAmount": "1000万元", "inflowAmount": "500.00万元" },
    { "id": "jc_group1", "name": "基础工程集团", "level": 4, "source": ["zxj", 'czbk'], "parent": "line_24", "inflowAmount": "1000.00万元" },
    { "id": "bj_82", "name": "中建八局", "level": 4, "source": ["zxj", 'czbk'], "parent": "line_23", "retainedAmount": "1000万元", "inflowAmount": "500.00万元" },
    { "id": "jc_group2", "name": "基础工程集团", "level": 4, "source": ["zxj", 'czbk'], "parent": "line_23", "inflowAmount": "1000.00万元" },
    { "id": "bj_83", "name": "中建八局", "level": 4, "source": ["zxj", 'czbk'], "parent": "line_22", "retainedAmount": "1000万元", "inflowAmount": "500.00万元" },
    { "id": "jc_group3", "name": "基础工程集团", "level": 4, "source": ["zxj", 'czbk'], "parent": "line_22", "inflowAmount": "1000.00万元" },
    { "id": "bj_84", "name": "中建八局", "level": 4, "source": ["zxj", 'czbk'], "parent": "line_21", "retainedAmount": "1000万元", "inflowAmount": "500.00万元" },
    { "id": "jc_group4", "name": "基础工程集团", "level": 4, "source": ["zxj", 'czbk'], "parent": "line_21", "inflowAmount": "1000.00万元" },
    { "id": "bj_3", "name": "中建三局", "level": 4, "source": ["zxj"], "parent": "line_21", "retainedAmount": "1000万元", "inflowAmount": "500.00万元" },

    // ---- 第五层：末端叶子节点 ----
    { "id": "y_zs", "name": "八局装饰", "level": 5, "source": ["zxj", 'czbk'], "parent": "bj_8", "inflowAmount": "100.00万元" },
    { "id": "y_jd1", "name": "上安机电", "level": 5, "source": ["zxj", 'czbk'], "parent": "bj_8", "inflowAmount": "100.00万元" },
    { "id": "y_lw", "name": "武东建筑劳务", "level": 5, "source": ["zxj", 'czbk'], "parent": "bj_8", "inflowAmount": "100.00万元" },
    { "id": "y_bl", "name": "南玻玻璃", "level": 5, "source": ["zxj"], "parent": "bj_8", "inflowAmount": "100.00万元" },
    { "id": "y_more1", "name": "123", "level": 5, "source": ["zxj"], "parent": "bj_8", "inflowAmount": "100.00万元" },
    { "id": "y_more2", "name": "456", "level": 5, "source": ['czbk'], "parent": "bj_8", "inflowAmount": "100.00万元" ,"retainedAmount": "1000万元",},
    { "id": "y_more3", "name": "789", "level": 5, "source": ["zxj"], "parent": "bj_8", "inflowAmount": "100.00万元" ,"retainedAmount": "1000万元",},
    
    { "id": "y_jd2", "name": "上安机电", "level": 5, "source": ["zxj"], "parent": "jc_group", "inflowAmount": "100.00万元" },
    
    { "id": "y_dl", "name": "起帆电缆", "level": 5, "source": ["zxj"], "parent": "bj_3", "inflowAmount": "100.00万元" },
    { "id": "y_fj", "name": "上虞风机", "level": 5, "source": ["zxj"], "parent": "bj_3", "inflowAmount": "100.00万元" },
    { "id": "y_yg", "name": "员工", "level": 5, "source": ["zxj"], "parent": "bj_3", "inflowAmount": "100.00万元" },
    { "id": "y_g", "name": "农民工", "level": 5, "source": ["zxj"], "parent": "bj_3", "inflowAmount": "100.00万元" }
];

/**
 * 核心优化版：树状递归合并裁剪拦截器
 * @param {Array} rawResponse 原始接口一维数组
 * @return {Array} 处理后的一维数组
 */
function processRawResponse(rawResponse) {
  if (!Array.isArray(rawResponse)) return [];

  // 1. 建立节点映射与完整的父子树状关系
  const nodeMap = {};
  rawResponse.forEach(item => {
    nodeMap[item.id] = { ...item, _children: [] };
  });

  const roots = [];
  rawResponse.forEach(item => {
    const node = nodeMap[item.id];
    if (node.parent && nodeMap[node.parent]) {
      nodeMap[node.parent]._children.push(node);
    } else {
      roots.push(node);
    }
  });

  // 最终展平输出的一维结果集
  const finalResultList = [];

  /**
   * 递归处理函数
   * @param {Array} nodeList 当前需要处理的一组兄弟节点
   * @param {string|null} forcedParentId 如果上级被合并了，下级被迫继承的父级 ID（即您提到的 E 的 ID）
   * @param {boolean} shouldForceOmit 当前这一组节点是否是因为“父辈被合并”而必须全员合并为 `...`
   */
  function recurseAndTruncate(nodeList, forcedParentId = null, shouldForceOmit = false) {
    if (!nodeList || nodeList.length === 0) return;

    // 更新当前层所有节点的 parent 指向（如果上级发生了合并变更）
    if (forcedParentId) {
      nodeList.forEach(n => { n.parent = forcedParentId; });
    }

    // 分流处理：是触发了“数量超限合并”或“父辈连带合并”，还是正常保留？
    const triggerOmit = shouldForceOmit || nodeList.length > 5;

    if (!triggerOmit) {
      // 🟢 情况 A：正常情况，全员保留，继续向下递归各自的子节点
      nodeList.forEach(node => {
        finalResultList.push(node);
        if (node._children && node._children.length > 0) {
          recurseAndTruncate(node._children, null, false);
        }
      });
    } else {
      // 🔴 情况 B：需要合并（可能是兄弟超过5个，也可能是父辈变成了 `...` 连带下来的）
      let realChildren = [];
      let excessNodes = [];

      if (shouldForceOmit) {
        // 如果是由于父辈合并连带的，这层的所有节点全部属于“超额”，直接全量合并
        excessNodes = nodeList;
      } else {
        // 如果是自身兄弟超过5个触发的，保留前 4 个，剩下的合并
        realChildren = nodeList.slice(0, 4);
        excessNodes = nodeList.slice(4);
      }

      // 1. 先把保留的 4 个亲生卡片放进去，并继续正常递归它们自己的子孙
      realChildren.forEach(node => {
        finalResultList.push(node);
        if (node._children && node._children.length > 0) {
          recurseAndTruncate(node._children, null, false);
        }
      });

      // 2. 开始收缴合并那些超额/连带的节点（E 节点本身）
      const parentId = forcedParentId || nodeList[0].parent;
      const childLevel = nodeList[0].level || 1;

      const summary = {
        inflow: 0,
        retained: 0,
        sourceSet: new Set(),
        mergedList: [],       // 存放当前层被吃掉的明细
        allNextChildren: []   // 收集这些被吃掉节点的所有下一代子节点
      };

      excessNodes.forEach(child => {
        // 累加当前层数据
        summary.inflow += parseAmount(child.inflowAmount);
        summary.retained += parseAmount(child.retainedAmount);
        if (Array.isArray(child.source)) {
          child.source.forEach(src => summary.sourceSet.add(src));
        }

        summary.mergedList.push({
          name: child.name || '',
          retainedAmount: child.retainedAmount || null,
          inflowAmount: child.inflowAmount || null
        });

        // 核心收集：把被吃掉的孩子名下的所有下一代直系子节点全部捞出来，准备喂给下一层的 `...`
        if (child._children && child._children.length > 0) {
          summary.allNextChildren.push(...child._children);
        }
      });

      // 3. 构建当前层的合并省略号卡片对象（即您说的 E 节点）
      const omitNodeId = `${parentId}_child`;
      const omitNode = {
        id: omitNodeId,
        name: '...',
        level: childLevel,
        parent: parentId,
        source: Array.from(summary.sourceSet),
        inflowAmount: formatAmount(summary.inflow),
        retainedAmount: summary.retained > 0 ? formatAmount(summary.retained) : null,
        isOmitNode: true,
        remainingNodes: summary.mergedList
      };

      finalResultList.push(omitNode);

      // 4. 🚀 关键跨代递归：如果这些被合并的节点名下还有子节点，强力向下递归
      // 强制将它们下一代所有子节点的 parent 指向当前这个新生成的 E 节点 (omitNodeId)
      // 并且强制设置 shouldForceOmit 为 true，确保它们在下一层也会乖乖合并成属于下一层的 `...`
      if (summary.allNextChildren.length > 0) {
        recurseAndTruncate(summary.allNextChildren, omitNodeId, true);
      }
    }
  }

  // 从根节点层（Level 1）开始递归清洗整棵树
  recurseAndTruncate(roots, null, false);

  finalResultList.forEach(node => {
    if ('_children' in node) {
      delete node._children;
    }
  });

  return finalResultList;
}

/**
 * 辅助清洗工具方法（带万元后缀转浮点数）
 */
function parseAmount(amountStr) {
  if (!amountStr) return 0;
  const cleaned = String(amountStr).replace(/[, \s 万元]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * 辅助清洗工具方法（格式化输出）
 */
function formatAmount(num) {
  return `${num.toFixed(2)}万元`;
}



/**
 * 带全量诊断日志版：1,2,3,4,5全层级拓扑布局主控器
 */
function layoutFourLevelsAndGetNewHeight(nodesByLevel, defaultCanvasHeight) {
  const minGap = 24; 
  const baseScreenHeight = defaultCanvasHeight;
  const screenCenter = baseScreenHeight / 2;

  // ==================== 🎯 1. 核心轴承：定死中央第 2 级（上海申通地铁） ====================
  const level2Nodes = nodesByLevel[2] || [];
  let level2Node = null
  if (level2Nodes.length > 0) {
    level2Node = level2Nodes[0]
    level2Nodes[0].y = Math.round(screenCenter - level2Nodes[0].height / 2);
  }
  const mainCenterY = level2Nodes[0] ? (level2Nodes[0].y + level2Nodes[0].height / 2) : screenCenter;

  // ==================== ➡️ 2. 向右侧发散：5 ➔ 4 ➔ 3 级逆向看齐 ====================
  let tempY = 0;
  const level5Nodes = nodesByLevel[5] || [];
  level5Nodes.forEach(node => {
    node.y = tempY;
    tempY += node.height + minGap;
  });

  const l5Top = level5Nodes[0] ? level5Nodes[0].y : 0;
  const l5Bottom = level5Nodes[level5Nodes.length - 1] ? (level5Nodes[level5Nodes.length - 1].y + level5Nodes[level5Nodes.length - 1].height) : 0;
  const l5Center = (l5Top + l5Bottom) / 2;

  const deltaY = mainCenterY - l5Center;
  level5Nodes.forEach(node => { node.y = Math.round(node.y + deltaY); });

  const rightReverseLevels =[4,3]; 
  rightReverseLevels.forEach(currentLevel => {
    const parentList = nodesByLevel[currentLevel] || [];
    
    // 💡 建立两个独立的队列，防止混合挤压
    const normalParents = [];
    const isolatedParents = [];
    
    parentList.forEach(parentNode => {
      const childNodes = parentNode.children || [];
      if (childNodes.length > 0) {
        normalParents.push(parentNode);
      } else {
        isolatedParents.push(parentNode);
      }
    });

    let maxNormalBottomY = null;

    // 🔷 A. 正常节点分配（咬住右侧，拉直单线）
    normalParents.forEach(parentNode => {
      const childNodes = parentNode.children;
      if (childNodes.length === 1) {
        const singleChild = childNodes[0];
        const childCenterY = singleChild.y + (singleChild.height / 2);
        parentNode.y = Math.round(childCenterY - parentNode.height / 2);
      } else if (childNodes.length > 1) {
        let sumChildCenters = 0;
        childNodes.forEach(child => { sumChildCenters += child.y + (child.height / 2); });
        parentNode.y = Math.round((sumChildCenters / childNodes.length) - parentNode.height / 2);
      }
      const currentBottomY = parentNode.y + parentNode.height;
      if (maxNormalBottomY === null || currentBottomY > maxNormalBottomY) {
        maxNormalBottomY = currentBottomY;
      }
    });

    // 🔶 B. 孤立节点分配：平铺排开
    if (isolatedParents.length > 0) {
      let currentIsolatedY = maxNormalBottomY !== null ? (maxNormalBottomY + minGap) : (mainCenterY - 22);
      isolatedParents.forEach(node => {
        node.y = Math.round(currentIsolatedY);
        currentIsolatedY += node.height + minGap;
      });
    }

    // ==================== 🌟 ✨ 【核心巨献：当前层级绝对防重叠弹开雷达】 ====================
    // 💡 哪怕上面因为极其复杂的父子绑定导致某些卡片算到了相同的 y，在这里都会被硬生生一脚踹开！
    if (parentList.length > 1) {
      // 1. 先把当前层的所有卡片，按照算出来的 y 坐标从小到大升序排列
      parentList.sort((a, b) => a.y - b.y);
      
      // 2. 像雷达扫描一样，从上往下挨个检查两两之间的物理距离
      for (let i = 0; i < parentList.length - 1; i++) {
        const currentNode = parentList[i];
        const nextNode = parentList[i + 1];
        
        // 算出当前卡片的底部边缘
        const currentBottom = currentNode.y + currentNode.height;
        
        // 🔒 触发碰撞拦截：如果下一个卡片的顶部，贴得太近或者已经盖在了当前卡片上面
        if (nextNode.y < (currentBottom + minGap)) {
          // 强行把下一个卡片的 y 坐标向推，留下完美的 minGap 像素隔离带！
          nextNode.y = Math.round(currentBottom + minGap);
        }
      }
    }
    // ===================================================================================
  });

  // 💡 1. 二次校准 3 级真实公共中心
  const level3Nodes = nodesByLevel[3] || [];
  if (level3Nodes.length > 0) {
    let sumL3Centers = 0;
    level3Nodes.forEach(node => { sumL3Centers += node.y + (node.height / 2); });
    const realRightCenterY = sumL3Centers / level3Nodes.length;

    if (level2Node) {
      level2Node.y = Math.round(realRightCenterY - level2Node.height / 2);
    }
  }

  // 💡 2. 更新中轴线
  const updatedMainCenterY = level2Node ? (level2Node.y + level2Node.height / 2) : screenCenter;

  // ==================== ⬅️ 3. 最左侧第 1 级（资金资产层）绝对中心平铺 ====================
  const level1Nodes = nodesByLevel[1] || [];
  const l1Count = level1Nodes.length;

  if (l1Count > 0) {
    let l1TotalHeight = 0;
    level1Nodes.forEach(node => { l1TotalHeight += node.height; });
    l1TotalHeight += (l1Count - 1) * minGap;

    let currentL1Y = updatedMainCenterY - (l1TotalHeight / 2);
    level1Nodes.forEach(node => {
      node.y = Math.round(currentL1Y);
      currentL1Y += node.height + minGap;
    });
  }

  // ==================== 🛡️ 4. 全局安全防溢出体检与画布等高撑开 ====================
  let minY = null;
  let maxY = null;
  const allLevels =[1,2,3,4,5];

  allLevels.forEach(level => {
    (nodesByLevel[level] || []).forEach(node => {
      if (minY === null || node.y < minY) minY = node.y;
      if (maxY === null || (node.y + node.height) > maxY) maxY = node.y + node.height;
    });
  });

  const padding = 50;
  if (minY === null || maxY === null) return baseScreenHeight;

  if (minY < padding) {
    const driftY = padding - minY;
    allLevels.forEach(level => {
      (nodesByLevel[level] || []).forEach(node => { node.y += driftY; });
    });
    maxY += driftY;
  }

  return Math.max(maxY + padding, baseScreenHeight);
}


/**
 * 纯动态几何推导：根据原始层级列表数据，全量自动生成带有精准对齐坐标和桩位的节点与边数据
 * @param {Array} response 原始输入数组（全动态自适应）
 * @param {Object} options 间距微调配置项（可选）
 * @returns {Object} { NODE_DATA, EDGE_DATA }
 */
export function transformListToAlignedTopology(rawData, containerDOM, options = {}) {
  const canvasWidth = containerDOM ? containerDOM.clientWidth : 1200; 
  const canvasHeight = containerDOM ? containerDOM.clientHeight : 600;
  // 2. 严格按照画布总宽度的百分比/比例系数划分
  const widthRatios = {
    1: options.ratio1 || 0.08,  // 第一级：占画布总宽 8%
    2: options.ratio2 || 0.26,  // 第二级：占画布总宽 26%
    3: options.ratio3 || 0.48,  // 第三级：占画布总宽 48%
    4: options.ratio4 || 0.70,  // 第四级：占画布总宽 70%
    5: options.ratio5 || 0.90   // 第五级：占画布总宽 90%
  };

  const config = {
    colX: { 
      1: Math.round(widthRatios[1] * canvasWidth),
      2: Math.round(widthRatios[2] * canvasWidth),
      3: Math.round(widthRatios[3] * canvasWidth),
      4: Math.round(widthRatios[4] * canvasWidth),
      5: Math.round(widthRatios[5] * canvasWidth)
    },
    leafGap: options.leafGap || 35,
    branchGap: options.branchGap || 220,
    canvasCenterY: options.canvasCenterY || 270
  };

  // 3. 动态读取结构，按层级划分并初始化各节点的默认宽高及类型
  const nodeMap = {};
  const nodesByLevel = { 1: [], 2: [], 3: [], 4: [], 5: [] };

  console.log("###### rawData",rawData)
  const response = processRawResponse(rawData)
  console.log("######",response)

  response.forEach(item => {
    let width = 110, height = 44;
    let type = undefined;

    if (item.level === 1) {
      type = 'source-node';
    } else if (item.level === 2) {
      width = 120; 
      height = 120; 
      type = 'center-card';
    } else if (item.level === 3) {
      type = 'line-node';
    } else if (item.level === 4) {
      width = 150; 
      height = item.retainedAmount ? 54 : 44; 
      type = 'target-card';
    } else if (item.level === 5) {
      width = 10; 
      height = 20;
    }

    nodeMap[item.id] = {
      ...item,
      width,
      height,
      type,
      x: config.colX[item.level], 
      y: 0,
      children: []
    };
    nodesByLevel[item.level].push(nodeMap[item.id]);
  });

  // 4. 构建父子反向索引网络
  response.forEach(item => {
    if (item.level === 2) {
      if (item.source && item.source.length > 0) {
        item.source.forEach(src => {
          const parentId = typeof src === 'object' ? src.id : src;
          if (nodeMap[parentId]) {
            nodeMap[parentId].children.push(nodeMap[item.id]);
          }
        });
      }
    } else if (item.level >= 3) {
      const parentId = item.parent;
      if (parentId && nodeMap[parentId]) {
        nodeMap[parentId].children.push(nodeMap[item.id]);
      }
    }
  });

  const finalCanvalHeight = layoutFourLevelsAndGetNewHeight(nodesByLevel, canvasHeight);

  // ==================== 二、结构体全自动化组装 ====================

  // 1. 构建输出带有物理坐标及连接端口的 NODE_DATA
  const NODE_DATA = response.map(item => {
    const cached = nodeMap[item.id];
    const targetIndex = nodesByLevel[item.level].findIndex(n=> n.id == item.id)
    const res = {
      id: item.id,
      x: Math.round(cached.x),
      y: Math.round(cached.y),
      width: cached.width,
      height: cached.height,
      label: item.name,
      ports: defaultPorts ,
      parent: item.parent,
      level: item.level,
      levelIndex: targetIndex,
      remainingNodes: item.remainingNodes
    };

    if (cached.type) res.type = cached.type;
    if (item.retainedAmount) res.subLabel = `留存金额：${item.retainedAmount}`;
    
    return res;
  });

  // 2. 纯动态提取流式链接关系，生成带有精准引出/引入桩配置的 EDGE_DATA
  let EDGE_DATA = [];
  const unionMap = new Map()
  response.forEach(item => {
    const currentId = item.id;

    // 情况 A：处理 Level 2 核心主体（依据自己的 source 数组上溯到多源头）
    if (item.level === 2 && item.source && item.source.length > 0) {
      item.source.forEach((src, sIdx) => {
        const srcId = typeof src === 'object' ? src.id : src;
        const amount = typeof src === 'object' ? src.amount : '';

        const lineColor = sourceColorPalette[sIdx] || '#ff9900';

        EDGE_DATA.push({
          sourceId: srcId,
          sourcePort:'right',
          targetId: currentId,
          targetPort: 'left',
          color: lineColor,
          labelText: amount,
          sourceTotal: item.source.length, // 1~2层连线一并补齐多线参数，方便统一处理
          level: 1,
          sourceIndex: sIdx
        });
      });
    }

    // 情况 B：处理 Level 3 级节点（核心修改点：统一接入 left 桩位，走偏移标记）
    if (item.level === 3 && item.parent) {
      const parentId = item.parent;
      const parentNode = nodeMap[parentId];
      const inflowAmount = item.inflowAmount || '';

      // 核心研判：如果父级节点（核心主体）拥有多源资金，且当前是主干的第一条线路，触发多平行线生成
      if (item.source && item.source.length > 1) {
        const sourceTotal = item.source.length;

        item.source.forEach((src, sIdx) => {
          const lineColor = sourceColorPalette[sIdx] || '#ff9900';

          EDGE_DATA.push({
            sourceId: parentId,
            sourcePort:'right',
            targetId: currentId,
            targetPort: 'left',            // 【重要修改】：不再扩展桩位名，统一指向左连接桩
            color: lineColor,
            labelText: sIdx === 0 ? inflowAmount : '', // 仅在第一条主线上挂载金额
            sourceTotal,                  // 平行线总数
            level: parentNode.level,
            sourceIndex: sIdx             // 当前线颜色/来源索引位置
          });
        });
      } else {
        // 普通单线（例如21号线）
        EDGE_DATA.push({
          sourceId: parentId,
          sourcePort:'right',
          targetId: currentId,
          targetPort: 'left',
          color: sourceColorPalette[0],
          labelText: inflowAmount,
          sourceTotal: 1,
          level: parentNode.level,
          sourceIndex: 0
        });
      }
    }

    // 情况 C：处理 Level 4 和 Level 5 节点
    if (item.level >= 4 && item.parent) {
      const parentId = item.parent;
      const parentNode = nodeMap[parentId];
      const inflowAmount = item.inflowAmount || '';

      // 将当前等级的source集合一下
      const groupKey = `${item.parent}_${item.level}`;
      
      if (!unionMap.has(groupKey)) {
        unionMap.set(groupKey, new Set());
      }
      
      const currentSet = unionMap.get(groupKey);
      item.source.forEach(src => currentSet.add(src));
      unionMap.set(groupKey, currentSet)

      const sourceTotal = item.source.length;

      item.source.forEach((src, sIdx) => {
        const lineColor = sourceColorPalette[sIdx] || '#ff9900';

        EDGE_DATA.push({
          sourceId: parentId,
          sourcePort: 'right',
          targetId: currentId,
          targetPort: "left", 
          lineSource:src,
          color: lineColor,
          labelText: sIdx === 0 ? inflowAmount : '', // 仅在第一条主线上挂载金额
          sourceTotal,                  // 平行线总数
          level: parentNode.level,
          sourceIndex: sIdx             // 当前线颜色/来源索引位置
        });
      });
    }
  });
  EDGE_DATA = EDGE_DATA.map(item =>{
    const groupKey = `${item.sourceId}_${item.level+1}`;
    const setArray = Array.from(unionMap.get(groupKey) || []);
    let colorIndex = setArray.indexOf(item.lineSource);
    return {
      ...item,
      colorIndex,
      colorTotal: setArray.length
    };
  })
  return { NODE_DATA, EDGE_DATA,finalCanvalHeight };
}



