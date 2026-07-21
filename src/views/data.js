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

    // ---- 第四层：建设单位 ----
    { "id": "bj_8", "name": "中建八局", "level": 4, "source": ["zxj", 'czbk'], "parent": "line_cm", "retainedAmount": "1000万元", "inflowAmount": "500.00万元" },
    { "id": "jc_group", "name": "基础工程集团", "level": 4, "source": ["zxj", 'czbk'], "parent": "line_cm", "inflowAmount": "1000.00万元" },
    { "id": "bj_3", "name": "中建三局", "level": 4, "source": ["zxj"], "parent": "line_21", "retainedAmount": "1000万元", "inflowAmount": "500.00万元" },

    // ---- 第五层：末端叶子节点 ----
    { "id": "y_zs", "name": "八局装饰", "level": 5, "source": ["zxj", 'czbk'], "parent": "bj_8", "inflowAmount": "100.00万元" },
    { "id": "y_jd1", "name": "上安机电", "level": 5, "source": ["zxj", 'czbk'], "parent": "bj_8", "inflowAmount": "100.00万元" },
    { "id": "y_lw", "name": "武东建筑劳务", "level": 5, "source": ["zxj", 'czbk'], "parent": "bj_8", "inflowAmount": "100.00万元" },
    { "id": "y_bl", "name": "南玻玻璃", "level": 5, "source": ["zxj"], "parent": "bj_8", "inflowAmount": "100.00万元" },
    { "id": "y_more1", "name": "......", "level": 5, "source": ["zxj", 'czbk'], "parent": "bj_8", "inflowAmount": "100.00万元" },
    
    { "id": "y_jd2", "name": "上安机电", "level": 5, "source": ["zxj"], "parent": "jc_group", "inflowAmount": "100.00万元" },
    
    { "id": "y_dl", "name": "起帆电缆", "level": 5, "source": ["zxj"], "parent": "bj_3", "inflowAmount": "100.00万元" },
    { "id": "y_fj", "name": "上虞风机", "level": 5, "source": ["zxj"], "parent": "bj_3", "inflowAmount": "100.00万元" },
    { "id": "y_yg", "name": "员工", "level": 5, "source": ["zxj"], "parent": "bj_3", "inflowAmount": "100.00万元" },
    { "id": "y_g", "name": "农民工", "level": 5, "source": ["zxj"], "parent": "bj_3", "inflowAmount": "100.00万元" }
];

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
    // 强制将唯一的中央核心卡片钉在屏幕视口的绝对正中心
    level2Nodes[0].y = Math.round(screenCenter - level2Nodes[0].height / 2);
  }
  // 获得雷打不动的绝对中心轴
  const mainCenterY = level2Nodes[0] ? (level2Nodes[0].y + level2Nodes[0].height / 2) : screenCenter;

  // ==================== ➡️ 2. 向右侧发散：5 ➔ 4 ➔ 3 级逆向由右向左级联看齐 ====================
  // 先把最右侧最庞大的第 5 级（叶子卡片）顺序线性平铺
  let tempY = 0;
  const level5Nodes = nodesByLevel[5] || [];
  level5Nodes.forEach(node => {
    node.y = tempY;
    tempY += node.height + minGap;
  });

  const l5Top = level5Nodes[0] ? level5Nodes[0].y : 0;
  const l5Bottom = level5Nodes[level5Nodes.length - 1] ? (level5Nodes[level5Nodes.length - 1].y + level5Nodes[level5Nodes.length - 1].height) : 0;
  const l5Center = (l5Top + l5Bottom) / 2;

  // 将第 5 级整体平移，使其中心轴和中央地铁的 mainCenterY 绝对完美重合
  const deltaY = mainCenterY - l5Center;
  level5Nodes.forEach(node => { node.y = Math.round(node.y + deltaY); });

  // 逆向推动右侧的 4 级和 3 级（父随子动模型，精确定位中建八局、三局、21号线等）
  const rightReverseLevels =[4, 3]; 
  rightReverseLevels.forEach(currentLevel => {
    const parentList = nodesByLevel[currentLevel] || [];
    parentList.forEach(parentNode => {
      const childNodes = parentNode.children || [];
      if (childNodes.length === 1) {
        const singleChild = childNodes[0];
        const childCenterY = singleChild.y + (singleChild.height / 2);
        parentNode.y = Math.round(childCenterY - parentNode.height / 2);
      } else if (childNodes.length > 1) {
        let sumChildCenters = 0;
        childNodes.forEach(child => { sumChildCenters += child.y + (child.height / 2); });
        parentNode.y = Math.round((sumChildCenters / childNodes.length) - parentNode.height / 2);
      } else {
        parentNode.y = Math.round(mainCenterY - parentNode.height / 2);
      }
    });
  });

   // 💡 1. 此时 3 级（崇明线、21号线）的坐标已经根据右侧完美算好了。我们直接量取 3 级真实的公共视觉中心！
  const level3Nodes = nodesByLevel[3] || [];
  
  if (level3Nodes.length > 0) {
    let sumL3Centers = 0;
    level3Nodes.forEach(node => { sumL3Centers += node.y + (node.height / 2); });
    
    // 🌟 这才是整张图在经历右侧节点暴增膨胀后，右侧世界真正、唯一的【黄金中轴线】！
    const realRightCenterY = sumL3Centers / level3Nodes.length;

    // 💡 2. 强力重写地铁（Level 2）的 Y 坐标，让它死死对准这个由于右侧膨胀而改变的真正中心！
    if (level2Node) {
      level2Node.y = Math.round(realRightCenterY - level2Node.height / 2);
    }
  }

  // 💡 3. 二次更新核心全局中轴线，让接下来的 Level 1（左侧层）也能基于这个真正对齐的中心进行排铺
  const updatedMainCenterY = level2Node ? (level2Node.y + level2Node.height / 2) : screenCenter;
  // ==================== ⬅️ 3. 极简重构：最左侧第 1 级（资金资产层）绝对中心平铺 ====================
  const level1Nodes = nodesByLevel[1] || [];
  const l1Count = level1Nodes.length;

  if (l1Count > 0) {
    // 💡 1. 瞬间精算出第 1 级所有卡片加上间距后的总物理占用高度
    let l1TotalHeight = 0;
    level1Nodes.forEach((node, idx) => { 
      l1TotalHeight += node.height; 
      console.log(`   -> [Level 1 原始高度体检] 节点[${idx}] - ${node.label || node.name || '资产'}: height = ${node.height}px`);
    });
    // 加上间距高度
    const totalGapsHeight = (l1Count - 1) * minGap;
    l1TotalHeight += totalGapsHeight;

    // 💡 2. 核心：以地铁的 mainCenterY 为纯粹的中轴天平，直接逆向算出第 1 级最顶部的起始 Y 坐标
    let currentL1Y = updatedMainCenterY - (l1TotalHeight / 2);

    // 💡 3. 从上到下，每次“平滑偏移固定距离”平铺赋予坐标
    level1Nodes.forEach((node, idx) => {
      node.y = Math.round(currentL1Y);
      console.log(`   -> [Level 1 实时定序] 节点[${idx}] - ${node.label || node.name}: 赋予 y = ${node.y}px`);
      currentL1Y += node.height + minGap;
    });

    // 验证赋完值后的几何中心
    const finalL1Top = level1Nodes[0].y;
    const finalL1Bottom = level1Nodes[l1Count - 1].y + level1Nodes[l1Count - 1].height;
    console.log(`   -> [Level 1 居中校准] 平铺后最顶部 y = ${finalL1Top}px, 最底部 y = ${finalL1Bottom}px, 算出的实际视觉中心点: ${(finalL1Top + finalL1Bottom) / 2}px (应该严格等于 mainCenterY: ${mainCenterY}px)`);
  }

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

  // 天花板安全红线校验（若数量暴增整体平移避让）
  if (minY < padding) {
    const driftY = padding - minY;

    allLevels.forEach(level => {
      (nodesByLevel[level] || []).forEach(node => { 
        node.y += driftY; 
      });
    });
    
    // 平移后重新核对 Level 1 和 Level 2 的对齐情况
    const debugL1Center = (nodesByLevel[1][0].y + nodesByLevel[1][nodesByLevel[1].length - 1].y + nodesByLevel[1][nodesByLevel[1].length - 1].height) / 2;
    const debugL2Center = nodesByLevel[2][0].y + (nodesByLevel[2][0].height / 2);
    console.log(`   -> [平移后二次核对] Level 1 搬迁后的新视觉中心: ${debugL1Center}px, 地铁(Level 2) 搬迁后的新中心: ${debugL2Center}px (两者如果不相等，说明数据在内存中被其他未知逻辑污染)`);
    
    maxY += driftY;
  }

  // 返回自适应拉伸后的最佳高度
  const idealCanvasHeight = Math.max(maxY + padding, baseScreenHeight);
  return idealCanvasHeight;
}



/**
 * 纯动态几何推导：根据原始层级列表数据，全量自动生成带有精准对齐坐标和桩位的节点与边数据
 * @param {Array} response 原始输入数组（全动态自适应）
 * @param {Object} options 间距微调配置项（可选）
 * @returns {Object} { NODE_DATA, EDGE_DATA }
 */
export function transformListToAlignedTopology(response, containerDOM, options = {}) {
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
      levelIndex: targetIndex
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



